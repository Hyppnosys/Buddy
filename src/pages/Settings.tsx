import { Card } from '../components/Card';
import { SettingsForm } from '../components/SettingsForm';

export function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Configurações</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Ajuste o timer, sons, aparência e notificações do jeito que funciona para você.</p>
      </div>
      <Card><SettingsForm /></Card>
    </div>
  );
}
