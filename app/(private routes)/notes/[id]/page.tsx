import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import { createQueryClient, notesQueryKeys } from '@/lib/query';
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} backHref={backHref} />
    </HydrationBoundary>
  );
}
