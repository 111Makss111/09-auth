'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

type CreateNoteModalProps = {
  closeHref: string;
};

export default function CreateNoteModal({
  closeHref,
}: CreateNoteModalProps) {
  const router = useRouter();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      router.push(closeHref);
      router.refresh();
    },
  });

  const handleSubmit = async (payload: CreateNotePayload) => {
    await createNoteMutation.mutateAsync(payload);
  };

  return (
    <Modal closeHref={closeHref}>
      <NoteForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(closeHref)}
        isPending={createNoteMutation.isPending}
        errorMessage={
          createNoteMutation.error instanceof Error
            ? createNoteMutation.error.message
            : ''
        }
      />
    </Modal>
  );
}
