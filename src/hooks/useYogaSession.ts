import { useCallback, useEffect, useRef, useState } from 'react';
import type { YogaRoutine } from '../types/wellness';
import {
  detectPoseFromVideoFrame,
  normalizeClassName,
  preloadModel,
  ModelLoadError,
  type PoseDetection,
  type CameraRotation,
} from '../services/poseDetectionService';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'error';
export type PoseFeedback = 'aguardando' | 'correta' | 'incorreta' | 'sem_deteccao';

const DETECTION_INTERVAL_MS = 800;
const MIN_CONFIDENCE = 0.45;
const ROTATION_STEPS: CameraRotation[] = [0, 90, 180, 270];

export function useYogaSession(routine: YogaRoutine) {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectionTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const detectionInFlightRef = useRef(false);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [poseIndex, setPoseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(routine.poses[0]?.seconds ?? 30);
  const [feedback, setFeedback] = useState<PoseFeedback>('aguardando');
  const [apiError, setApiError] = useState<string | null>(null);
  // Última predição bruta do modelo, para diagnóstico (mostrada na tela).
  const [lastDetection, setLastDetection] = useState<PoseDetection | null>(null);
  // Correção manual de orientação: algumas webcams entregam o frame
  // "deitado" (rotacionado), o que faz o modelo (treinado só com gente em
  // pé) não reconhecer nada. A pessoa pode girar até se ver em pé no preview.
  const [rotation, setRotation] = useState<CameraRotation>(0);

  const attachVideoElement = useCallback((node: HTMLVideoElement | null) => {
    videoElementRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!canvasRef.current && typeof document !== 'undefined') {
      canvasRef.current = document.createElement('canvas');
    }
    if (!rotationCanvasRef.current && typeof document !== 'undefined') {
      rotationCanvasRef.current = document.createElement('canvas');
    }

    async function startCamera() {
      setCameraStatus('requesting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
        }
        setCameraStatus('ready');
      } catch (error) {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setCameraStatus('denied');
          setCameraError(
            'Permissão de câmera negada. Habilite o acesso à câmera nas configurações do navegador para praticar yoga.',
          );
        } else {
          setCameraStatus('error');
          setCameraError('Não foi possível acessar a câmera neste dispositivo.');
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    preloadModel()
      .then(() => {
        if (!cancelled) setModelReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setModelError(
          error instanceof ModelLoadError
            ? error.message
            : 'Não foi possível carregar o modelo de detecção de poses.',
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (detectionTimerRef.current !== null) {
      window.clearInterval(detectionTimerRef.current);
      detectionTimerRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const currentPose = routine.poses[poseIndex];

  const runDetection = useCallback(async () => {
    const video = videoElementRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !currentPose || video.readyState < 2) return;
    if (detectionInFlightRef.current) return;
    detectionInFlightRef.current = true;

    try {
      const best = await detectPoseFromVideoFrame(video, canvas, rotation, rotationCanvasRef.current ?? undefined);
      setLastDetection(best);

      if (!best || best.confidence < MIN_CONFIDENCE) {
        setFeedback('sem_deteccao');
        return;
      }

      const expectedClass = currentPose.englishName ?? currentPose.name;
      const matches = normalizeClassName(best.class) === normalizeClassName(expectedClass);
      setFeedback(matches ? 'correta' : 'incorreta');
      setApiError(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Erro ao rodar o modelo de detecção.');
    } finally {
      detectionInFlightRef.current = false;
    }
  }, [currentPose, rotation]);

  const cycleRotation = useCallback(() => {
    setRotation((prev) => {
      const currentIndex = ROTATION_STEPS.indexOf(prev);
      return ROTATION_STEPS[(currentIndex + 1) % ROTATION_STEPS.length];
    });
  }, []);

  const skipPose = useCallback(() => {
    setPoseIndex((prev) => {
      const next = prev + 1;
      if (next >= routine.poses.length) {
        setIsActive(false);
        setIsComplete(true);
        clearTimers();
        return prev;
      }
      setSecondsLeft(routine.poses[next]?.seconds ?? 30);
      setFeedback('aguardando');
      return next;
    });
  }, [routine, clearTimers]);

  useEffect(() => {
    if (!isActive || cameraStatus !== 'ready' || !modelReady) return;
    clearTimers();
    detectionTimerRef.current = window.setInterval(runDetection, DETECTION_INTERVAL_MS);
    countdownTimerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        skipPose();
        return prev;
      });
    }, 1000);
    return clearTimers;
  }, [isActive, cameraStatus, modelReady, runDetection, skipPose, clearTimers]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsComplete(false);
    setPoseIndex(0);
    setSecondsLeft(routine.poses[0]?.seconds ?? 30);
    setFeedback('aguardando');
    setApiError(null);
  }, [routine]);

  const stop = useCallback(() => {
    setIsActive(false);
    clearTimers();
    setPoseIndex(0);
    setSecondsLeft(routine.poses[0]?.seconds ?? 30);
    setFeedback('aguardando');
  }, [clearTimers, routine]);

  const progress = currentPose ? 1 - secondsLeft / currentPose.seconds : 0;
  const canStart = cameraStatus === 'ready' && modelReady;

  return {
    videoRef: attachVideoElement,
    cameraStatus,
    cameraError,
    modelReady,
    modelError,
    canStart,
    isActive,
    isComplete,
    currentPose,
    poseIndex,
    totalPoses: routine.poses.length,
    secondsLeft,
    progress,
    feedback,
    apiError,
    lastDetection,
    rotation,
    cycleRotation,
    start,
    stop,
    skipPose,
  };
}
