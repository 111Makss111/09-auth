import Link from 'next/link';
import css from './NotePreview.module.css';
import type { Note } from '@/types/note';

type NotePreviewProps = {
  note: Note;
  backHref: string;
};

const formatDate = (dateValue: string) => {
  if (!dateValue) {
    return '';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));
};

export default function NotePreview({ note, backHref }: NotePreviewProps) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <Link href={backHref} prefetch={false} className={css.backBtn}>
          Back
        </Link>

        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {formatDate(note.updatedAt || note.createdAt)}
        </p>
      </div>
    </div>
  );
}
