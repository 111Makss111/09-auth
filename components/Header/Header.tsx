import Link from 'next/link';
import css from './Header.module.css';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" prefetch={false} className={css.headerLink}>
        NoteHub
      </Link>

      <ul className={css.navigation}>
        <li className={css.navigationItem}>
          <Link href="/notes" prefetch={false} className={css.navigationLink}>
            Notes
          </Link>
        </li>

        <AuthNavigation />
      </ul>
    </header>
  );
}
