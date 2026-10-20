import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { SessionService } from '../Services/client';
import { errorMessage } from '../Services/client';
import { createQueryClient } from '../Services/query';
export function useSession(service: SessionService, sharedClient?: QueryClient) {
  const local = useMemo(createQueryClient, [service]);
  const client = sharedClient || local;
  const query = useQuery(
    {
      queryKey: ['session'],
      queryFn: async () => {
        try {
          return await service.read();
        } catch (error) {
          if (
            error &&
            typeof error === 'object' &&
            'status_code' in error &&
            error.status_code === 401
          )
            return null;
          throw error;
        }
      },
    },
    client,
  );
  const signIn = useMutation(
    {
      mutationFn: ({ email, password }: { email: string; password: string }) =>
        service.signIn({ email, password }),
      onSuccess: (session) => {
        client.removeQueries({ predicate: (q) => q.queryKey[0] !== 'session' });
        client.setQueryData(['session'], session);
      },
    },
    client,
  );
  const signOut = useMutation(
    {
      mutationFn: () => service.signOut(),
      onSuccess: () => {
        client.removeQueries({ predicate: (q) => q.queryKey[0] !== 'session' });
        client.setQueryData(['session'], null);
      },
    },
    client,
  );
  return {
    loading: query.isPending,
    session: query.data || null,
    error: query.error
      ? errorMessage(query.error)
      : signIn.error
        ? errorMessage(signIn.error)
        : signOut.error
          ? errorMessage(signOut.error)
          : '',
    busy: signIn.isPending || signOut.isPending,
    async signIn(email: string, password: string) {
      try {
        await signIn.mutateAsync({ email, password });
      } catch {}
    },
    async signOut() {
      try {
        await signOut.mutateAsync();
      } catch {}
    },
    refresh: () => query.refetch(),
  };
}
