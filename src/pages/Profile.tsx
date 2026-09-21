import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Profile() {
  const { currentUser, updateProfile, logOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateProfile((prev) => ({ ...prev, avatarDataUrl: dataUrl }));
  };

  const removeAvatar = () => updateProfile((prev) => ({ ...prev, avatarDataUrl: null }));

  const handleSave = () => {
    updateProfile((prev) => ({ ...prev, name: name.trim() || prev.name, bio }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Perfil</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Seus dados, sua foto, do seu jeito.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {currentUser.avatarDataUrl ? (
            <img src={currentUser.avatarDataUrl} alt="" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-(--color-focus) text-white flex items-center justify-center text-3xl font-semibold">{currentUser.name.charAt(0).toUpperCase()}</div>
          )}
          <button onClick={() => fileInputRef.current?.click()} aria-label="Alterar foto de perfil" className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-(--color-surface) border border-(--color-border) shadow-(--shadow-soft) flex items-center justify-center hover:bg-(--color-surface-alt) transition-colors">
            <Camera size={15} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        {currentUser.avatarDataUrl && (
          <button onClick={removeAvatar} className="flex items-center gap-1.5 text-xs text-(--color-danger) hover:underline">
            <Trash2 size={13} />
            Remover foto
          </button>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <div>
          <label htmlFor="profile-name" className="text-sm font-medium block mb-1.5">Nome</label>
          <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">E-mail</label>
          <input type="email" value={currentUser.email} disabled className="w-full rounded-xl border border-(--color-border) bg-(--color-surface-alt) px-4 py-2.5 text-sm text-(--color-ink-muted)" />
        </div>
        <div>
          <label htmlFor="profile-bio" className="text-sm font-medium block mb-1.5">Sobre você</label>
          <textarea id="profile-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Um pouco sobre sua rotina, seus objetivos..." className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>Salvar alterações</Button>
          {saved && <span className="text-sm text-(--color-success)">Salvo ✓</span>}
        </div>
      </Card>

      <Card>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-(--color-danger) hover:underline">
          <LogOut size={16} />
          Sair da conta
        </button>
      </Card>
    </div>
  );
}
