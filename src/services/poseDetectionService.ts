import * as ort from 'onnxruntime-web';

export interface PoseDetection {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Nomes das classes NA MESMA ORDEM usada no treino (veja src/data/data.yaml,
 * campo `names`). Se o modelo for retreinado com classes diferentes ou em
 * outra ordem, atualize esta lista também.
 */
const CLASS_NAMES = [
  'Goddess pose',
  'Namaskara pose',
  'Raised arm pose',
  'Side bend pose',
  'Tree Pose',
  'Triangel pose',
  'Warrior 1 pose',
  'Warrior 2 pose',
  'chair pose',
];

const MODEL_URL = '/models/yolo-pose.onnx';
const INPUT_SIZE = 640;
const LETTERBOX_COLOR = 114; // cinza padrão usado no letterbox do YOLO

// Aponta o onnxruntime-web para os binários .wasm certos (mesma versão do pacote instalado).
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';

let sessionPromise: Promise<ort.InferenceSession> | null = null;

export class ModelLoadError extends Error {}

function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ['wasm'],
    }).catch((error) => {
      sessionPromise = null; // permite tentar de novo numa próxima chamada
      throw new ModelLoadError(
        `Não foi possível carregar o modelo em ${MODEL_URL}. Confirme que o arquivo .onnx do seu ` +
          `modelo treinado está em public/models/yolo-pose.onnx. Detalhe: ${
            error instanceof Error ? error.message : String(error)
          }`,
      );
    });
  }
  return sessionPromise;
}

/** Pré-carrega o modelo (chame cedo, ex. ao abrir a tela da rotina, para a 1ª detecção não demorar). */
export function preloadModel(): Promise<ort.InferenceSession> {
  return getSession();
}

export type CameraRotation = 0 | 90 | 180 | 270;

interface LetterboxResult {
  data: Float32Array;
  scale: number;
  padX: number;
  padY: number;
}

/**
 * Desenha o frame do vídeo já rotacionado num canvas auxiliar (mesmo tamanho
 * físico do vídeo, trocando largura/altura quando a rotação for de 90° ou
 * 270°). Isso corrige o caso em que a webcam entrega o frame "deitado" e o
 * modelo, treinado só com gente em pé, não reconhece nada (confiança ~0%).
 */
function rotateFrame(
  video: HTMLVideoElement,
  rotationCanvas: HTMLCanvasElement,
  rotation: CameraRotation,
): HTMLCanvasElement | HTMLVideoElement {
  if (rotation === 0) return video;

  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;
  const swapDimensions = rotation === 90 || rotation === 270;
  rotationCanvas.width = swapDimensions ? sourceHeight : sourceWidth;
  rotationCanvas.height = swapDimensions ? sourceWidth : sourceHeight;

  const context = rotationCanvas.getContext('2d');
  if (!context) {
    throw new Error('Não foi possível acessar o contexto 2D do canvas de rotação.');
  }

  context.save();
  context.translate(rotationCanvas.width / 2, rotationCanvas.height / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.drawImage(video, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
  context.restore();

  return rotationCanvas;
}

function letterboxToTensor(
  source: HTMLVideoElement | HTMLCanvasElement,
  canvas: HTMLCanvasElement,
): LetterboxResult {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Não foi possível acessar o contexto 2D do canvas.');
  }

  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
  const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.height;

  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;
  context.fillStyle = `rgb(${LETTERBOX_COLOR}, ${LETTERBOX_COLOR}, ${LETTERBOX_COLOR})`;
  context.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);

  const scale = Math.min(INPUT_SIZE / sourceWidth, INPUT_SIZE / sourceHeight);
  const resizedWidth = Math.round(sourceWidth * scale);
  const resizedHeight = Math.round(sourceHeight * scale);
  const padX = Math.floor((INPUT_SIZE - resizedWidth) / 2);
  const padY = Math.floor((INPUT_SIZE - resizedHeight) / 2);
  context.drawImage(source, padX, padY, resizedWidth, resizedHeight);

  const { data } = context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
  const area = INPUT_SIZE * INPUT_SIZE;
  const floatData = new Float32Array(3 * area);
  for (let i = 0; i < area; i++) {
    floatData[i] = data[i * 4] / 255; // canal R
    floatData[area + i] = data[i * 4 + 1] / 255; // canal G
    floatData[2 * area + i] = data[i * 4 + 2] / 255; // canal B
  }

  return { data: floatData, scale, padX, padY };
}

/**
 * Roda a inferência local (sem rede) num frame do vídeo e retorna SEMPRE a
 * detecção de maior confiança entre todas as âncoras, mesmo que o valor seja
 * baixo — a decisão de considerar isso "detectado" ou não é do chamador
 * (useYogaSession), que compara com o limiar. Isso permite mostrar o valor
 * real de confiança na tela para diagnóstico, em vez de só null/não-null.
 */
export async function detectPoseFromVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  rotation: CameraRotation = 0,
  rotationCanvas?: HTMLCanvasElement,
): Promise<PoseDetection | null> {
  const session = await getSession();
  const source = rotation !== 0 && rotationCanvas ? rotateFrame(video, rotationCanvas, rotation) : video;
  const { data, scale, padX, padY } = letterboxToTensor(source, canvas);

  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];
  const inputTensor = new ort.Tensor('float32', data, [1, 3, INPUT_SIZE, INPUT_SIZE]);

  const results = await session.run({ [inputName]: inputTensor });
  const output = results[outputName];
  const outData = output.data as Float32Array;

  const numAttrs = output.dims[1]; // 4 (caixa) + nº de classes
  const numAnchors = output.dims[2];
  const numClasses = numAttrs - 4;

  let bestScore = 0;
  let bestClassIdx = -1;
  let bestBox = { cx: 0, cy: 0, w: 0, h: 0 };

  for (let anchor = 0; anchor < numAnchors; anchor++) {
    for (let classIdx = 0; classIdx < numClasses; classIdx++) {
      const score = outData[(4 + classIdx) * numAnchors + anchor];
      if (score > bestScore) {
        bestScore = score;
        bestClassIdx = classIdx;
        bestBox = {
          cx: outData[0 * numAnchors + anchor],
          cy: outData[1 * numAnchors + anchor],
          w: outData[2 * numAnchors + anchor],
          h: outData[3 * numAnchors + anchor],
        };
      }
    }
  }

  if (bestClassIdx === -1) {
    return null; // só acontece se o modelo não tiver nenhuma classe (não deveria ocorrer)
  }

  return {
    class: CLASS_NAMES[bestClassIdx] ?? `classe_${bestClassIdx}`,
    confidence: bestScore,
    x: (bestBox.cx - padX) / scale,
    y: (bestBox.cy - padY) / scale,
    width: bestBox.w / scale,
    height: bestBox.h / scale,
  };
}

/**
 * Normaliza nomes de classe para comparação (remove acentos, espaços, caixa).
 */
export function normalizeClassName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
}
