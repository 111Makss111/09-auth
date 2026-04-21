import css from './layout.module.css';
import SidebarNotes from '@/components/SidebarNotes/SidebarNotes';

type NotesLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function NotesLayout({ children }: NotesLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        <SidebarNotes />
      </aside>

      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}
