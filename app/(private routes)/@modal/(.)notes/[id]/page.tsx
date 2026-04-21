import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';
import { fetchNoteById } from '@/lib/api/serverApi';
import type { Note } from '@/types/note';

type NotePreviewModalPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function NotePreviewModalPage({
  params,
  searchParams,
}: NotePreviewModalPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const cookieHeader = (await cookies()).toString();
  const backHref = from ? decodeURIComponent(from) : '/notes';
  let note: Note;

  try {
    note = await fetchNoteById(id, cookieHeader);
  } catch {
    notFound();
  }

  return (
    <Modal closeHref={backHref}>
      <NotePreview note={note} backHref={backHref} />
    </Modal>
  );
}
