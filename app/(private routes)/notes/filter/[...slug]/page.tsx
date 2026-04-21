import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import css from '../../page.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import CreateNote from '@/components/CreateNote/CreateNote';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api/serverApi';
import type { NotesResponse } from '@/types/note';

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
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox />
        <CreateNote />
      </div>

      <NoteList notes={notesResponse.notes} />

      <Pagination
        currentPage={notesResponse.page}
        totalPages={notesResponse.totalPages}
        basePath={basePath}
        search={search}
      />
    </main>
  );
}
