'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import NoteDetails from '@/components/NoteDetails/NoteDetails';
import Loader from '@/components/Loader/Loader';
import { fetchNoteById } from '@/lib/api/clientApi';
import { notesQueryKeys } from '@/lib/query';
import { useNoteStore } from '@/lib/store/noteStore';

type NoteDetailsClientProps = {
  id: string;
  backHref: string;
};

export default function NoteDetailsClient({
  id,
  backHref,
}: NoteDetailsClientProps) {
  const params = useParams<{ id?: string }>();
  const noteId = params.id ?? id;
  const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
  const clearSelectedNote = useNoteStore((state) => state.clearSelectedNote);
  const noteQuery = useQuery({
    queryKey: notesQueryKeys.detail(noteId),
    queryFn: () => fetchNoteById(noteId),
  });

  useEffect(() => {
    if (!noteQuery.data) {
      return;
    }

    setSelectedNote(noteQuery.data);

    return () => {
      clearSelectedNote();
    };
  }, [clearSelectedNote, noteQuery.data, setSelectedNote]);

  if (noteQuery.isPending && !noteQuery.data) {
    return <Loader />;
  }

  if (noteQuery.isError || !noteQuery.data) {
    return <p>Unable to load the note.</p>;
  }

  return <NoteDetails note={noteQuery.data} backHref={backHref} />;
}
