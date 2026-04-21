'use client';

import { useEffect } from 'react';
import NoteDetails from '@/components/NoteDetails/NoteDetails';
import { useNoteStore } from '@/lib/store/noteStore';
import type { Note } from '@/types/note';

type NoteDetailsClientProps = {
  note: Note;
  backHref: string;
};

export default function NoteDetailsClient({
  note,
  backHref,
}: NoteDetailsClientProps) {
  const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
  const clearSelectedNote = useNoteStore((state) => state.clearSelectedNote);

  useEffect(() => {
    setSelectedNote(note);

    return () => {
      clearSelectedNote();
    };
  }, [clearSelectedNote, note, setSelectedNote]);

  return <NoteDetails note={note} backHref={backHref} />;
}
