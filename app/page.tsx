import Link from 'next/link';
import css from './page.module.css';

export default function HomePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Welcome to NoteHub</h1>
        <p className={css.description}>
          Keep your notes in one place, protect access with authentication, and
          manage your profile in a familiar Next.js App Router app.
        </p>
        <p className={css.description}>
          Start with <Link href="/sign-in">Sign in</Link> or create a new
          account on <Link href="/sign-up">Sign up</Link>.
        </p>
      </div>
    </main>
  );
}
