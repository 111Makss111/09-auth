'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import NotePreview from '@/components/NotePreview/NotePreview';
import Loader from '@/components/Loader/Loader';
import { fetchNoteById } from '@/lib/api/clientApi';
import { notesQueryKeys } from '@/lib/query';
import { useNoteStore } from '@/lib/store/noteStore';

type NotePreviewClientProps = {
  id: string;
};

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();
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
    return <p>Unable to load the note preview.</p>;
  }

  return <NotePreview note={noteQuery.data} onClose={() => router.back()} />;
}
