import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import { createQueryClient, notesQueryKeys } from '@/lib/query';
import NotesClient from './Notes.client';

type FilteredNotesPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function FilteredNotesPage({
  params,
  searchParams,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const search = queryParams.search ?? '';
  const page = Number(queryParams.page ?? 1) || 1;
  const tag = decodeURIComponent(slug.at(-1) ?? '');
  const cookieHeader = (await cookies()).toString();
  const queryClient = createQueryClient();

  if (!tag || tag === 'All') {
    redirect('/notes');
  }

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
