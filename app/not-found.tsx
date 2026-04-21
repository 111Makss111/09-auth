import Link from 'next/link';
import css from './page.module.css';

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Page not found</h1>
        <p className={css.description}>
          The page you requested does not exist or is no longer available.
        </p>
        <p className={css.description}>
          Return to the <Link href="/">home page</Link> or open{' '}
          <Link href="/notes">your notes</Link>.
        </p>
      </div>
    </main>
  );
}
