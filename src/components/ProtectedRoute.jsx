import { Navigate } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);

  if (authLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" thickness="3px" color="teal.500" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
