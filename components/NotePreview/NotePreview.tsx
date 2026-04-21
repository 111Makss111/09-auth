import css from './NotePreview.module.css';
import type { Note } from '@/types/note';

type NotePreviewProps = {
  note: Note;
  onClose: () => void;
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

export default function NotePreview({ note, onClose }: NotePreviewProps) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <button type="button" className={css.backBtn} onClick={onClose}>
          Close
        </button>

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
