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

export type AmbientSoundId = 'forest' | 'waves' | 'rain' | 'white-noise' | 'birds' | 'piano' | 'trees';

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
    case 'forest': {
      // Unchanged — approved as-is.
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
    case 'birds': {
      // Sparse, soft, varied chirps over near-silence — a calm natural
      // scene, not a busy/loud aviary.
      const bedGain = context.createGain();
      bedGain.gain.value = 0.03;
      const bed = makeLoopingNoiseSource(context, 'brown');
      const bedLowpass = context.createBiquadFilter();
      bedLowpass.type = 'lowpass';
      bedLowpass.frequency.value = 500;
      bed.connect(bedLowpass).connect(bedGain).connect(output);
      bed.start();
      nodes.push(bed, bedLowpass, bedGain);
      stops.push(() => bed.stop());

      const chirpGain = context.createGain();
      chirpGain.gain.value = 1;
      chirpGain.connect(output);
      let birdTimer: number | null = null;
      const scheduleBird = () => {
        const now = context.currentTime;
        const notes = 2 + Math.floor(Math.random() * 3);
        const baseFreq = 2200 + Math.random() * 1600;
        for (let i = 0; i < notes; i++) {
          const osc = context.createOscillator();
          osc.type = 'sine';
          const t = now + i * (0.09 + Math.random() * 0.05);
          const freq = baseFreq + (Math.random() - 0.5) * 500;
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * (0.8 + Math.random() * 0.3), t + 0.08);
          const g = context.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.045 + Math.random() * 0.03, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(g).connect(chirpGain);
          osc.start(t);
          osc.stop(t + 0.15);
        }
        birdTimer = window.setTimeout(scheduleBird, 1800 + Math.random() * 4500);
      };
      birdTimer = window.setTimeout(scheduleBird, 900);
      nodes.push(chirpGain);
      stops.push(() => {
        if (birdTimer !== null) window.clearTimeout(birdTimer);
      });
      break;
    }
    case 'piano': {
      // A slow, soft, ambient piano-style pad: notes from a calm major-9th
      // chord are picked at random and played one at a time with a gentle
      // pluck envelope (fast attack, long decay) through a warm lowpass, so
      // it never feels busy or rhythmic — just a quiet, tranquil texture.
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C D E G A C (major add9)
      const voiceBus = context.createGain();
      voiceBus.gain.value = 1;
      const warmth = context.createBiquadFilter();
      warmth.type = 'lowpass';
      warmth.frequency.value = 2600;
      voiceBus.connect(warmth).connect(output);
      nodes.push(voiceBus, warmth);

      let noteTimer: number | null = null;
      const playNote = () => {
        const freq = notes[Math.floor(Math.random() * notes.length)] * (Math.random() < 0.3 ? 0.5 : 1);
        const now = context.currentTime;
        const osc1 = context.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.value = freq;
        const osc2 = context.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2.003; // slightly detuned octave for shimmer
        const env = context.createGain();
        const peak = 0.09 + Math.random() * 0.05;
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(peak, now + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0005, now + 3 + Math.random() * 1.5);
        const oscMix = context.createGain();
        oscMix.gain.value = 1;
        const osc2Gain = context.createGain();
        osc2Gain.gain.value = 0.18;
        osc1.connect(oscMix);
        osc2.connect(osc2Gain).connect(oscMix);
        oscMix.connect(env).connect(voiceBus);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 5);
        osc2.stop(now + 5);
        noteTimer = window.setTimeout(playNote, 1800 + Math.random() * 2600);
      };
      noteTimer = window.setTimeout(playNote, 400);
      stops.push(() => {
        if (noteTimer !== null) window.clearTimeout(noteTimer);
      });
      break;
    }
    case 'trees': {
      // Leaves/branches rustling in a light breeze: filtered noise with a
      // fast, irregular flutter (two summed LFOs at different, non-locking
      // rates) instead of the slow single swell used for waves — that
      // difference is what makes it read as "leaves", not "ocean".
      const source = makeLoopingNoiseSource(context, 'white');
      const bandpass = context.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 3200;
      bandpass.Q.value = 0.9;
      const gain = context.createGain();
      gain.gain.value = 0.16;
      const flutter = context.createGain();
      flutter.gain.value = 1;

      const lfo1 = context.createOscillator();
      lfo1.type = 'sine';
      lfo1.frequency.value = 0.6;
      const lfo1Depth = context.createGain();
      lfo1Depth.gain.value = 0.22;
      const lfo2 = context.createOscillator();
      lfo2.type = 'sine';
      lfo2.frequency.value = 1.7;
      const lfo2Depth = context.createGain();
      lfo2Depth.gain.value = 0.15;
      lfo1.connect(lfo1Depth).connect(flutter.gain);
      lfo2.connect(lfo2Depth).connect(flutter.gain);
      lfo1.start();
      lfo2.start();

      source.connect(bandpass).connect(gain).connect(flutter).connect(output);
      source.start();
      nodes.push(source, bandpass, gain, flutter, lfo1, lfo1Depth, lfo2, lfo2Depth);
      stops.push(() => {
        source.stop();
        lfo1.stop();
        lfo2.stop();
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
