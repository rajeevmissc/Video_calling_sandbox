// hooks/useProviderId.js
import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const useProviderId = () => {
  const { user } = useAuth();

  const providerId = useMemo(() => {
    // Try to get from localStorage first
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.providerId || user?.providerId;
  }, [user]);

  return providerId;
};