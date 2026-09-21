/**
 * Real, working ambient sound playback using the Web Audio API.
 *
 * There are no external audio files bundled with the app (and none can be
 * fetched from the network in this environment), so each ambient sound is
 * synthesized on the fly from filtered noise/oscillators and looped for as
 * long as it's enabled — the same approach already used for the breathing
 * tone, extended to cover every option in the "Sons" tab. This is a single
 * shared engine (one AudioContext) so the currently selected sound keeps
 * playing consistently wherever it's referenced (the Sons tab and the
 * breathing/relaxation screens both just read the same settings state).
 */

export type AmbientSoundId = 'waves' | 'rain' | 'white-noise' | 'piano';

interface ActiveGraph {
  id: AmbientSoundId;
  nodes: AudioNode[];
  stop: () => void;
  outputGain: GainNode;
}

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let active: ActiveGraph | null = null;
let currentVolume = 0.5;

function getContext(): AudioContext {
  if (!ctx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctx();
    masterGain = ctx.createGain();
    masterGain.gain.value = currentVolume;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function noiseBuffer(context: AudioContext, seconds: number, color: 'white' | 'brown'): AudioBuffer {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  if (color === 'white') {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
  }
  return buffer;
}

function makeLoopingNoiseSource(context: AudioContext, color: 'white' | 'brown'): AudioBufferSourceNode {
  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context, 4, color);
  source.loop = true;
  return source;
}

function buildGraph(id: AmbientSoundId, context: AudioContext): ActiveGraph {
  const output = context.createGain();
  output.gain.value = 1;
  output.connect(masterGain!);
  const nodes: AudioNode[] = [];
  const stops: (() => void)[] = [];

  switch (id) {
    case 'waves': {
      // Unchanged — approved as-is.
      const source = makeLoopingNoiseSource(context, 'white');
      const lowpass = context.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 900;
      const swellGain = context.createGain();
      swellGain.gain.value = 0.4;
      const lfo = context.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12;
      const lfoDepth = context.createGain();
      lfoDepth.gain.value = 0.28;
      lfo.connect(lfoDepth).connect(swellGain.gain);
      lfo.start();
      source.connect(lowpass).connect(swellGain).connect(output);
      source.start();
      nodes.push(source, lowpass, swellGain, lfo, lfoDepth);
      stops.push(() => {
        source.stop();
        lfo.stop();
      });
      break;
    }
    case 'rain': {
      // "Chuvisco na janela": almost no continuous body at all (just a
      // hint of air), carried by small, frequent, soft "tick" transients —
      // like individual light drops landing on glass — instead of a
      // constant hiss/roar. Deliberately much quieter and sparser than a
      // real rainfall bed.
      const air = makeLoopingNoiseSource(context, 'white');
      const airHighpass = context.createBiquadFilter();
      airHighpass.type = 'highpass';
      airHighpass.frequency.value = 3000;
      const airLowpass = context.createBiquadFilter();
      airLowpass.type = 'lowpass';
      airLowpass.frequency.value = 5500;
      const airGain = context.createGain();
      airGain.gain.value = 0.045;
      air.connect(airHighpass).connect(airLowpass).connect(airGain).connect(output);
      air.start();
      nodes.push(air, airHighpass, airLowpass, airGain);
      stops.push(() => air.stop());

      const dropGain = context.createGain();
      dropGain.gain.value = 1;
      dropGain.connect(output);
      let dropTimer: number | null = null;
      const scheduleDrop = () => {
        const drop = context.createBufferSource();
        drop.buffer = noiseBuffer(context, 0.04, 'white');
        const bandpass = context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 900 + Math.random() * 1300;
        bandpass.Q.value = 3.5;
        const popGain = context.createGain();
        const now = context.currentTime;
        const peak = 0.05 + Math.random() * 0.06;
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(peak, now + 0.003);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + Math.random() * 0.03);
        drop.connect(bandpass).connect(popGain).connect(dropGain);
        drop.start(now);
        drop.stop(now + 0.12);
        dropTimer = window.setTimeout(scheduleDrop, 70 + Math.random() * 220);
      };
      dropTimer = window.setTimeout(scheduleDrop, 200);
      nodes.push(dropGain);
      stops.push(() => {
        if (dropTimer !== null) window.clearTimeout(dropTimer);
      });
      break;
    }
    case 'white-noise': {
      // A plain, smooth, broadband "shhh" — steady, no flutter, no
      // transients, no LFO — so it reads as its own distinct, calm option
      // rather than a variant of the rain or waves sounds.
      const source = makeLoopingNoiseSource(context, 'white');
      const highpass = context.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 150;
      const lowpass = context.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 7500;
      const gain = context.createGain();
      gain.gain.value = 0.28;
      source.connect(highpass).connect(lowpass).connect(gain).connect(output);
      source.start();
      nodes.push(source, highpass, lowpass, gain);
      stops.push(() => source.stop());
      break;
    }
    case 'piano': {
      // A gentle, slow AMBIENT MELODY — a fixed, calm phrase that loops
      // (not random isolated notes) — played on a soft, warm piano-like
      // voice (two slightly detuned oscillators through a lowpass, with a
      // slow attack and a long release so nothing ever feels struck or
      // sudden), plus a very quiet sustained low pad underneath for warmth.
      // Tempo is slow (~46 BPM) and dynamics stay soft and even throughout.
      const voiceBus = context.createGain();
      voiceBus.gain.value = 1;
      const warmth = context.createBiquadFilter();
      warmth.type = 'lowpass';
      warmth.frequency.value = 2200;
      voiceBus.connect(warmth).connect(output);
      nodes.push(voiceBus, warmth);

      const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.0, A4 = 440.0;
      const G3 = 196.0;
      // [frequency in Hz, length in beats] — a simple, peaceful phrase in
      // C major pentatonic. `null` frequency is a rest.
      const melody: [number | null, number][] = [
        [E4, 2], [G4, 1], [A4, 1.5], [G4, 0.5], [E4, 1.5], [D4, 1],
        [C4, 2.5], [null, 1],
        [D4, 1.5], [E4, 1], [G4, 2], [E4, 1.5],
        [C4, 2], [null, 1.5],
        [G3, 2], [A4, 1.5], [G4, 1], [E4, 2], [D4, 1.5],
        [C4, 3], [null, 2],
      ];
      const beatSeconds = 0.85;

      const playNote = (freq: number, duration: number) => {
        const now = context.currentTime;
        const osc1 = context.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.value = freq;
        const osc2 = context.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2.003; // slightly detuned octave for shimmer
        const env = context.createGain();
        const peak = 0.075;
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(peak, now + 0.25); // slow, soft attack
        env.gain.exponentialRampToValueAtTime(0.0004, now + duration + 1.2); // long release
        const osc2Gain = context.createGain();
        osc2Gain.gain.value = 0.16;
        osc1.connect(env);
        osc2.connect(osc2Gain).connect(env);
        env.connect(voiceBus);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 1.5);
        osc2.stop(now + duration + 1.5);
      };

      // Soft, sustained low pad — refreshed every loop so it never cuts out.
      const padGain = context.createGain();
      padGain.gain.value = 0.03;
      padGain.connect(output);
      const padOsc = context.createOscillator();
      padOsc.type = 'sine';
      padOsc.frequency.value = G3 / 2;
      padOsc.connect(padGain);
      padOsc.start();
      nodes.push(padGain, padOsc);
      stops.push(() => padOsc.stop());

      let melodyTimer: number | null = null;
      let stepIndex = 0;
      const scheduleStep = () => {
        const [freq, beats] = melody[stepIndex];
        const durationSeconds = beats * beatSeconds;
        if (freq !== null) playNote(freq, durationSeconds);
        stepIndex = (stepIndex + 1) % melody.length;
        melodyTimer = window.setTimeout(scheduleStep, durationSeconds * 1000);
      };
      melodyTimer = window.setTimeout(scheduleStep, 300);
      stops.push(() => {
        if (melodyTimer !== null) window.clearTimeout(melodyTimer);
      });
      break;
    }
  }

  return {
    id,
    nodes,
    outputGain: output,
    stop: () => {
      const now = context.currentTime;
      output.gain.cancelScheduledValues(now);
      output.gain.setTargetAtTime(0, now, 0.25);
      window.setTimeout(() => {
        stops.forEach((fn) => {
          try {
            fn();
          } catch {
            // already stopped
          }
        });
        output.disconnect();
      }, 500);
    },
  };
}

export function playAmbientSound(id: AmbientSoundId) {
  const context = getContext();
  if (context.state === 'suspended') context.resume();
  if (active && active.id === id) return;
  if (active) active.stop();
  active = buildGraph(id, context);
}

export function stopAmbientSound() {
  if (active) {
    active.stop();
    active = null;
  }
}

export function setAmbientVolume(volume: number) {
  currentVolume = volume;
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.15);
  }
}
