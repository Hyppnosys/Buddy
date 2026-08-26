import { Modal } from './Modal';
import { SettingsForm } from './SettingsForm';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Configurações">
      <SettingsForm />
    </Modal>
  );
}
