'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';
import Loader from '@/components/Loader/Loader';

type AuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
};

const PRIVATE_PREFIXES = ['/profile', '/notes'];

const isPrivatePath = (pathname: string) =>
  PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export default function AuthProvider({
  children,
  initialUser,
}: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  const requiresAuth = isPrivatePath(pathname);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearIsAuthenticated();
      queryClient.removeQueries({ queryKey: ['auth'] });
      router.replace('/sign-in');
      router.refresh();
    },
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      queryClient.setQueryData(['auth', 'me'], initialUser);
      return;
    }

    clearIsAuthenticated();
    queryClient.removeQueries({ queryKey: ['auth', 'me'] });
  }, [clearIsAuthenticated, initialUser, queryClient, setUser]);

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session', pathname],
    queryFn: async () => {
      const hasSession = await checkSession();

      if (!hasSession) {
        return null;
      }

      const user = await getMe();
      return user;
    },
    enabled: requiresAuth,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!requiresAuth || !sessionQuery.isSuccess) {
      return;
    }

    if (sessionQuery.data) {
      setUser(sessionQuery.data);
      queryClient.setQueryData(['auth', 'me'], sessionQuery.data);
      return;
    }

    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
    }
  }, [
    logoutMutation,
    requiresAuth,
    sessionQuery.data,
    sessionQuery.isSuccess,
    queryClient,
    setUser,
  ]);

  useEffect(() => {
    if (!requiresAuth || !sessionQuery.isError) {
      return;
    }

    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
    }
  }, [logoutMutation, requiresAuth, sessionQuery.isError]);

  if (
    requiresAuth &&
    (sessionQuery.isPending ||
      sessionQuery.isFetching ||
      logoutMutation.isPending)
  ) {
    return <Loader />;
  }

  return <>{children}</>;
}
