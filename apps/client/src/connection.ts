import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { checkConnection, resolveApiUrl } from './api';
export function useConnection() {
  let base = '';
  let configurationError = '';
  try {
    base = resolveApiUrl(process.env.EXPO_PUBLIC_API_URL, Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : undefined);
  } catch (error) { configurationError = error instanceof Error ? error.message : 'Invalid API configuration'; }
  const query = useQuery({
    queryKey: ['connection', base],
    queryFn: ({ signal }) => checkConnection(base, signal),
    enabled: Boolean(base), retry: false, staleTime: 30000,
  });
  return { ...query, base, configurationError };
}
