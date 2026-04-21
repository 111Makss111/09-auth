import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import css from './page.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import CreateNote from '@/components/CreateNote/CreateNote';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api/serverApi';
import type { NotesResponse } from '@/types/note';

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
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox />
        <CreateNote />
      </div>

      <NoteList notes={notesResponse.notes} />

      <Pagination
        currentPage={notesResponse.page}
        totalPages={notesResponse.totalPages}
        search={search}
        tag={tag}
      />
    </main>
  );
}
