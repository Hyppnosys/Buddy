import { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { playAmbientSound, setAmbientVolume, stopAmbientSound } from '../utils/ambientSoundEngine';
import type { AmbientSoundId } from '../utils/ambientSoundEngine';

/**
 * Renders nothing — it just keeps the shared ambient-sound engine in sync
 * with the user's selection in the "Sons" tab (`settings.sound`), no matter
 * which screen they're on. Mounted once in AppLayout so the selected sound
 * (and whether it's currently playing) is centralized instead of being
 * re-implemented per screen.
 */
export function AmbientSoundEngine() {
  const { settings } = useSettings();
  const { enabled, activeSoundId, volume } = settings.sound;

  useEffect(() => {
    if (enabled && activeSoundId) {
      playAmbientSound(activeSoundId as AmbientSoundId);
    } else {
      stopAmbientSound();
    }
  }, [enabled, activeSoundId]);

  useEffect(() => {
    setAmbientVolume(volume);
  }, [volume]);

  useEffect(() => stopAmbientSound, []);

  return null;
}
