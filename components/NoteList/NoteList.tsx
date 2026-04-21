'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import { notesQueryKeys } from '@/lib/query';
import { useNoteStore } from '@/lib/store/noteStore';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const setNotes = useNoteStore((state) => state.setNotes);

  const currentQuery = searchParams.toString();
  const from = currentQuery ? `${pathname}?${currentQuery}` : pathname;

  useEffect(() => {
    setNotes(notes);
  }, [notes, setNotes]);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async (_deletedNote, deletedId) => {
      await queryClient.invalidateQueries({
        queryKey: notesQueryKeys.lists(),
      });
      queryClient.removeQueries({
        queryKey: notesQueryKeys.detail(deletedId),
      });
    },
  });

  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <div>
              <button
                type="button"
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>{' '}
              <Link
                href={`/notes/${note.id}?from=${encodeURIComponent(from)}`}
                prefetch={false}
                className={css.link}
              >
                View details
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
