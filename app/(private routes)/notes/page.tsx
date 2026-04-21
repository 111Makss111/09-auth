import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchNotes } from '@/lib/api/serverApi';
import type { NotesResponse } from '@/types/note';
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
  let notesResponse: NotesResponse;

  try {
    notesResponse = await fetchNotes({ search, page, tag }, cookieHeader);
  } catch {
    redirect('/sign-in');
  }

  return (
    <NotesClient
      notes={notesResponse.notes}
      currentPage={notesResponse.page}
      totalPages={notesResponse.totalPages}
      basePath="/notes"
      search={search}
      tag={tag}
    />
  );
}
