'use client';

import { FormEvent, useState } from 'react';
import css from './NoteForm.module.css';
import { NOTE_TAGS } from '@/types/note';
import type { CreateNotePayload } from '@/lib/api/clientApi';

type NoteFormProps = {
  onSubmit: (payload: CreateNotePayload) => Promise<void> | void;
  onCancel: () => void;
  isPending?: boolean;
  errorMessage?: string;
};

export default function NoteForm({
  onSubmit,
  onCancel,
  isPending = false,
  errorMessage = '',
}: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<(typeof NOTE_TAGS)[number]>('Todo');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      tag,
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          rows={6}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          value={tag}
          onChange={(event) =>
            setTag(event.target.value as (typeof NOTE_TAGS)[number])
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
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Save
        </button>
      </div>
    </form>
  );
}
