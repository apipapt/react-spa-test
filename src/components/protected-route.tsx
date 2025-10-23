import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import type { ReactNode } from 'react';

// ProtectedRoute sekarang menerima children dan merendernya bila terautentikasi
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;