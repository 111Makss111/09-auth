import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchNotes } from '@/lib/api/serverApi';
import type { NotesResponse } from '@/types/note';
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
  let notesResponse: NotesResponse;

  if (!tag || tag === 'All') {
    redirect('/notes');
  }

  try {
    notesResponse = await fetchNotes({ search, page, tag }, cookieHeader);
  } catch {
    redirect('/sign-in');
  }

  const basePath = `/notes/filter/${slug.map(encodeURIComponent).join('/')}`;

  return (
    <NotesClient
      notes={notesResponse.notes}
      currentPage={notesResponse.page}
      totalPages={notesResponse.totalPages}
      basePath={basePath}
      search={search}
    />
  );
}
