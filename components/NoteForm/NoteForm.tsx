'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';
import { NOTE_TAGS } from '@/types/note';
import type { CreateNotePayload } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';

type NoteFormProps = {
  onSubmit: (payload: CreateNotePayload) => Promise<void> | void;
  isPending?: boolean;
  errorMessage?: string;
};

export default function NoteForm({
  onSubmit,
  isPending = false,
  errorMessage = '',
}: NoteFormProps) {
  const router = useRouter();
  const draft = useNoteStore((state) => state.draft);
  const updateDraft = useNoteStore((state) => state.updateDraft);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={(event) => updateDraft({ title: event.target.value })}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          rows={6}
          value={draft.content}
          onChange={(event) => updateDraft({ content: event.target.value })}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          value={draft.tag}
          onChange={(event) =>
            updateDraft({
              tag: event.target.value as (typeof NOTE_TAGS)[number],
            })
          }
        >
          {NOTE_TAGS.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Save
        </button>
      </div>
    </form>
  );
}
