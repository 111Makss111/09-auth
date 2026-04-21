'use client';

import css from '../../page.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import CreateNote from '@/components/CreateNote/CreateNote';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import type { Note } from '@/types/note';

type NotesClientProps = {
  notes: Note[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  search?: string;
  tag?: string;
};

export default function NotesClient({
  notes,
  currentPage,
  totalPages,
  basePath,
  search = '',
  tag = '',
}: NotesClientProps) {
  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox />
        <CreateNote />
      </div>

      <NoteList notes={notes} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        search={search}
        tag={tag}
      />
    </main>
  );
}
