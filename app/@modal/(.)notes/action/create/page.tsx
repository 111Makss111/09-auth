import CreateNoteModal from '@/components/CreateNote/CreateNoteModal';

type CreateNoteInterceptedPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function CreateNoteInterceptedPage({
  searchParams,
}: CreateNoteInterceptedPageProps) {
  const { from } = await searchParams;
  const closeHref = from ? decodeURIComponent(from) : '/notes';

  return <CreateNoteModal closeHref={closeHref} />;
}
