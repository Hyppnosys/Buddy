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

export type AmbientSoundId = 'rain' | 'forest' | 'waves' | 'fireplace' | 'calm';

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
    case 'rain': {
      // A light, calm drizzle — not a storm: narrower band (no low rumble,
      // no harsh top-end hiss), lower overall level, and a slow, gentle
      // amplitude flutter so it reads as soft, continuous rainfall rather
      // than a wall of noise.
      const source = makeLoopingNoiseSource(context, 'white');
      const highpass = context.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1800;
      const lowpass = context.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 4200;
      const gain = context.createGain();
      gain.gain.value = 0.22;
      const flutter = context.createGain();
      flutter.gain.value = 1;
      const lfo = context.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.35;
      const lfoDepth = context.createGain();
      lfoDepth.gain.value = 0.12;
      lfo.connect(lfoDepth).connect(flutter.gain);
      lfo.start();
      source.connect(highpass).connect(lowpass).connect(gain).connect(flutter).connect(output);
      source.start();
      nodes.push(source, highpass, lowpass, gain, flutter, lfo, lfoDepth);
      stops.push(() => {
        source.stop();
        lfo.stop();
      });
      break;
    }
    case 'forest': {
      const source = makeLoopingNoiseSource(context, 'brown');
      const bandpass = context.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 700;
      bandpass.Q.value = 0.6;
      const gain = context.createGain();
      gain.gain.value = 0.5;
      source.connect(bandpass).connect(gain).connect(output);
      source.start();
      nodes.push(source, bandpass, gain);
      stops.push(() => source.stop());

      // occasional soft high "chirp" blips for a lightly alive forest feel
      const chirpGain = context.createGain();
      chirpGain.gain.value = 0;
      chirpGain.connect(output);
      let chirpTimer: number | null = null;
      const scheduleChirp = () => {
        const osc = context.createOscillator();
        osc.type = 'sine';
        const freq = 1800 + Math.random() * 900;
        osc.frequency.setValueAtTime(freq, context.currentTime);
        osc.connect(chirpGain);
        const now = context.currentTime;
        chirpGain.gain.cancelScheduledValues(now);
        chirpGain.gain.setValueAtTime(0, now);
        chirpGain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        chirpGain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.35);
        chirpTimer = window.setTimeout(scheduleChirp, 2500 + Math.random() * 4000);
      };
      chirpTimer = window.setTimeout(scheduleChirp, 1500);
      nodes.push(chirpGain);
      stops.push(() => {
        if (chirpTimer !== null) window.clearTimeout(chirpTimer);
      });
      break;
    }
    case 'waves': {
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
    case 'fireplace': {
      // Deliberately unlike rain: no continuous hiss at all. A very soft,
      // warm low rumble (embers) plus sparse, irregular high-passed noise
      // "pops" (crackling wood) — a clearly different listening experience.
      const embers = makeLoopingNoiseSource(context, 'brown');
      const embersLowpass = context.createBiquadFilter();
      embersLowpass.type = 'lowpass';
      embersLowpass.frequency.value = 220;
      const embersGain = context.createGain();
      embersGain.gain.value = 0.18;
      embers.connect(embersLowpass).connect(embersGain).connect(output);
      embers.start();
      nodes.push(embers, embersLowpass, embersGain);
      stops.push(() => embers.stop());

      const crackleGain = context.createGain();
      crackleGain.gain.value = 1;
      crackleGain.connect(output);
      let crackleTimer: number | null = null;
      const scheduleCrackle = () => {
        const pop = context.createBufferSource();
        pop.buffer = noiseBuffer(context, 0.05, 'white');
        const bandpass = context.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1400 + Math.random() * 2200;
        bandpass.Q.value = 1.2;
        const popGain = context.createGain();
        const now = context.currentTime;
        const peak = 0.12 + Math.random() * 0.16;
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(peak, now + 0.005);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + Math.random() * 0.05);
        pop.connect(bandpass).connect(popGain).connect(crackleGain);
        pop.start(now);
        pop.stop(now + 0.2);
        crackleTimer = window.setTimeout(scheduleCrackle, 220 + Math.random() * 900);
      };
      crackleTimer = window.setTimeout(scheduleCrackle, 400);
      nodes.push(crackleGain);
      stops.push(() => {
        if (crackleTimer !== null) window.clearTimeout(crackleTimer);
      });
      break;
    }
    case 'calm': {
      const source = makeLoopingNoiseSource(context, 'brown');
      const lowpass = context.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 320;
      const noiseGain = context.createGain();
      noiseGain.gain.value = 0.35;
      source.connect(lowpass).connect(noiseGain).connect(output);
      source.start();
      nodes.push(source, lowpass, noiseGain);
      stops.push(() => source.stop());

      const padGain = context.createGain();
      padGain.gain.value = 0.06;
      padGain.connect(output);
      const osc1 = context.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 110;
      const osc2 = context.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 164.8;
      osc1.connect(padGain);
      osc2.connect(padGain);
      osc1.start();
      osc2.start();
      nodes.push(padGain, osc1, osc2);
      stops.push(() => {
        osc1.stop();
        osc2.stop();
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
