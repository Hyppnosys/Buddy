import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// `isLoading` fica true só enquanto a sessão salva (se houver) está sendo
// restaurada do banco, na primeira carga da página — sem isso, um usuário
// já logado seria mandado para /login por um instante a cada F5, antes do
// perfil terminar de carregar.
export function ProtectedRoute() {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) return null;
  if (currentUser) return <Navigate to="/app" replace />;
  return <Outlet />;
}
