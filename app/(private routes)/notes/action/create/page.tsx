import CreateNoteModal from '@/components/CreateNote/CreateNoteModal';

type CreateNotePageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function CreateNotePage({
  searchParams,
}: CreateNotePageProps) {
  const { from } = await searchParams;
  const closeHref = from ? decodeURIComponent(from) : '/notes';

  return <CreateNoteModal closeHref={closeHref} />;
}
