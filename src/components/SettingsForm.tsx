import { useState } from 'react';
import { Bell, Palette, Sparkles, Timer as TimerIcon, Trash2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSessions } from '../hooks/useSessions';
import { useTheme } from '../hooks/useTheme';
import { NumberField } from './NumberField';
import { Toggle } from './Toggle';
import { SoundPlayer } from './SoundPlayer';
import { Button } from './Button';
import { getNotificationPermission, requestNotificationPermission } from '../services/notifications';

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-(--color-ink-muted) uppercase tracking-wide mb-1">
      {icon}
      {children}
    </h3>
  );
}

function ConfirmAction({ label, confirmLabel, onConfirm }: { label: string; confirmLabel: string; onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-between gap-3 py-2">
        <span className="text-sm">{confirmLabel}</span>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>Cancelar</Button>
          <Button size="sm" variant="danger" onClick={() => { onConfirm(); setConfirming(false); }}>Confirmar</Button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="flex items-center gap-2 text-sm font-medium text-(--color-danger) py-2 hover:underline">
      <Trash2 size={15} />
      {label}
    </button>
  );
}

export function SettingsForm() {
  const { settings, updateSettings, timerSettings, updateTimerSettings } = useSettings();
  const { clearHistory } = useSessions();
  const { theme, toggleTheme } = useTheme();
  const [notice, setNotice] = useState<string | null>(null);

  const handleNotificationsToggle = async (checked: boolean) => {
    if (!checked) {
      updateSettings((prev) => ({ ...prev, notificationsEnabled: false }));
      return;
    }
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      updateSettings((prev) => ({ ...prev, notificationsEnabled: true }));
      setNotice(null);
    } else if (permission === 'unsupported') {
      setNotice('Seu navegador não suporta notificações.');
    } else {
      setNotice('Permissão de notificação negada. Ative-a nas configurações do navegador.');
    }
  };

  const currentPermission = getNotificationPermission();

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-1">
        <SectionTitle icon={<TimerIcon size={14} />}>Timer</SectionTitle>
        <div className="divide-y divide-(--color-border)">
          <NumberField label="Duração do foco" value={timerSettings.focusMinutes} onChange={(v) => updateTimerSettings((prev) => ({ ...prev, focusMinutes: v }))} />
          <NumberField label="Pausa curta" value={timerSettings.shortBreakMinutes} onChange={(v) => updateTimerSettings((prev) => ({ ...prev, shortBreakMinutes: v }))} />
          <NumberField label="Pausa longa" value={timerSettings.longBreakMinutes} onChange={(v) => updateTimerSettings((prev) => ({ ...prev, longBreakMinutes: v }))} />
          <NumberField label="Sessões até a pausa longa" value={timerSettings.sessionsBeforeLongBreak} min={2} max={8} suffix="" onChange={(v) => updateTimerSettings((prev) => ({ ...prev, sessionsBeforeLongBreak: v }))} />
          <Toggle checked={timerSettings.autoStartNext} onChange={(checked) => updateTimerSettings((prev) => ({ ...prev, autoStartNext: checked }))} label="Iniciar próxima sessão automaticamente" description="Ao concluir, o próximo período começa sem precisar tocar em Iniciar." />
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle icon={<Sparkles size={14} />}>Sons ambientes</SectionTitle>
        <SoundPlayer />
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle icon={<Palette size={14} />}>Interface</SectionTitle>
        <div className="divide-y divide-(--color-border)">
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Modo escuro" description="Alterne entre os temas claro e escuro." />
          <Toggle checked={settings.animationsEnabled} onChange={(checked) => updateSettings((prev) => ({ ...prev, animationsEnabled: checked }))} label="Animações" description="Desative para uma experiência mais estática." />
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle icon={<Bell size={14} />}>Notificações</SectionTitle>
        <Toggle checked={settings.notificationsEnabled && currentPermission === 'granted'} onChange={handleNotificationsToggle} label="Notificações do navegador" description="Receba um aviso quando uma sessão terminar." />
        {notice && <p className="text-xs text-(--color-danger) mt-1">{notice}</p>}
      </section>

      <section className="flex flex-col gap-1">
        <SectionTitle icon={<Trash2 size={14} />}>Dados</SectionTitle>
        <ConfirmAction label="Limpar histórico" confirmLabel="Apagar todo o histórico de sessões? Essa ação não pode ser desfeita." onConfirm={clearHistory} />
      </section>
    </div>
  );
}
