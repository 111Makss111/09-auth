import { QueryClient } from '@tanstack/react-query';
import type { FetchNotesParams } from '@/lib/api/clientApi';

const defaultQueryOptions = {
  queries: {
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: 1,
  },
};

const normalizeNotesParams = (params: FetchNotesParams = {}) => ({
  search: params.search ?? '',
  page: params.page ?? 1,
  tag: params.tag ?? '',
});

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: defaultQueryOptions,
  });

export const notesQueryKeys = {
  all: ['notes'] as const,
  lists: () => ['notes', 'list'] as const,
  list: (params: FetchNotesParams = {}) =>
    ['notes', 'list', normalizeNotesParams(params)] as const,
  details: () => ['notes', 'detail'] as const,
  detail: (id: string) => ['notes', 'detail', id] as const,
};
