import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/serverApi';
import { createQueryClient, notesQueryKeys } from '@/lib/query';
import NotePreviewClient from './NotePreview.client';

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
  const queryClient = createQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: notesQueryKeys.detail(id),
      queryFn: () => fetchNoteById(id, cookieHeader),
    });
  } catch {
    notFound();
  }

  return (
    <Modal closeHref={backHref}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreviewClient id={id} />
      </HydrationBoundary>
    </Modal>
  );
}
