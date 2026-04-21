import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/serverApi';
import type { Note } from '@/types/note';
import NoteDetailsClient from './NoteDetails.client';

type NoteDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function NoteDetailsPage({
  params,
  searchParams,
}: NoteDetailsPageProps) {
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

  return <NoteDetailsClient note={note} backHref={backHref} />;
}
