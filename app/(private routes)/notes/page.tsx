import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import { createQueryClient, notesQueryKeys } from '@/lib/query';
import NotesClient from './filter/[...slug]/Notes.client';

type NotesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    tag?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const search = params.search ?? '';
  const tag = params.tag ?? '';
  const page = Number(params.page ?? 1) || 1;
  const cookieHeader = (await cookies()).toString();
  const queryClient = createQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: notesQueryKeys.list({ search, page, tag }),
      queryFn: () => fetchNotes({ search, page, tag }, cookieHeader),
    });
  } catch {
    redirect('/sign-in');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        key={`notes:${tag}:${search}:${page}`}
        initialPage={page}
        initialSearch={search}
        initialTag={tag}
      />
    </HydrationBoundary>
  );
}
