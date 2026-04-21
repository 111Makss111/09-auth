'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export default function CreateNote() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
  });

  const handleSubmit = async (payload: CreateNotePayload) => {
    await createNoteMutation.mutateAsync(payload);
  };

  return (
    <>
      <button
        type="button"
        className={css.button}
        onClick={() => setIsOpen(true)}
      >
        Create note
      </button>

      {isOpen ? (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            isPending={createNoteMutation.isPending}
            errorMessage={
              createNoteMutation.error instanceof Error
                ? createNoteMutation.error.message
                : ''
            }
          />
        </Modal>
      ) : null}
    </>
  );
}
