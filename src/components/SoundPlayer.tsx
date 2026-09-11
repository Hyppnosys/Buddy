import { CloudRain, Pause, Play, Radio, Trees, Volume2, Waves, Wind } from 'lucide-react';
import { AMBIENT_SOUNDS } from '../utils/sounds';
import { useSettings } from '../hooks/useSettings';

const ICONS: Record<string, typeof CloudRain> = { CloudRain, Trees, Waves, Radio, Wind };

export function SoundPlayer() {
  const { settings, updateSettings } = useSettings();
  const { sound } = settings;

  const selectSound = (id: string) => {
    updateSettings((prev) => ({ ...prev, sound: { ...prev.sound, activeSoundId: prev.sound.activeSoundId === id ? null : id } }));
  };
  const setVolume = (volume: number) => updateSettings((prev) => ({ ...prev, sound: { ...prev.sound, volume } }));
  const activeSound = AMBIENT_SOUNDS.find((s) => s.id === sound.activeSoundId);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AMBIENT_SOUNDS.map((s) => {
          const Icon = ICONS[s.icon] ?? Radio;
          const isActive = sound.activeSoundId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectSound(s.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-200
                ${isActive ? 'border-(--color-relax) bg-(--color-relax-soft) text-(--color-relax)' : 'border-(--color-border) text-(--color-ink-muted) hover:border-(--color-relax) hover:text-(--color-relax)'}`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{s.name}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button
          disabled={!activeSound}
          onClick={() => updateSettings((prev) => ({ ...prev, sound: { ...prev.sound, enabled: !prev.sound.enabled } }))}
          aria-label={sound.enabled ? 'Pausar som ambiente' : 'Tocar som ambiente'}
          className="w-11 h-11 shrink-0 rounded-full bg-(--color-relax) text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-opacity"
        >
          {sound.enabled && activeSound ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <Volume2 size={18} className="text-(--color-ink-muted) shrink-0" />
        <input type="range" min={0} max={1} step={0.01} value={sound.volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume do som ambiente" className="flex-1 accent-(--color-relax)" />
      </div>
      {!activeSound && <p className="text-xs text-(--color-ink-muted)">Escolha um som acima. Os arquivos de áudio podem ser adicionados futuramente — a estrutura já está pronta.</p>}
    </div>
  );
}
