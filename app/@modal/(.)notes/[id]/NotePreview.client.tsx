'use client';

import { useEffect } from 'react';
import NotePreview from '@/components/NotePreview/NotePreview';
import { useNoteStore } from '@/lib/store/noteStore';
import type { Note } from '@/types/note';

type NotePreviewClientProps = {
  note: Note;
  backHref: string;
};

export default function NotePreviewClient({
  note,
  backHref,
}: NotePreviewClientProps) {
  const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
  const clearSelectedNote = useNoteStore((state) => state.clearSelectedNote);

  useEffect(() => {
    setSelectedNote(note);

    return () => {
      clearSelectedNote();
    };
  }, [clearSelectedNote, note, setSelectedNote]);

  return <NotePreview note={note} backHref={backHref} />;
}
