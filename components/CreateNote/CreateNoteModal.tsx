'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '@/lib/api/clientApi';
import { notesQueryKeys } from '@/lib/query';
import { useNoteStore } from '@/lib/store/noteStore';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

type CreateNoteModalProps = {
  closeHref: string;
};

export default function CreateNoteModal({
  closeHref,
}: CreateNoteModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetDraft = useNoteStore((state) => state.resetDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.lists() });
      resetDraft();
      router.push(closeHref);
    },
  });

  const handleSubmit = async (payload: CreateNotePayload) => {
    await createNoteMutation.mutateAsync(payload);
  };

  return (
    <Modal closeHref={closeHref}>
      <NoteForm
        onSubmit={handleSubmit}
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
