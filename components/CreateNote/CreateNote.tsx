'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import css from './CreateNote.module.css';

export default function CreateNote() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();
  const from = currentQuery ? `${pathname}?${currentQuery}` : pathname;

  return (
    <Link
      href={`/notes/action/create?from=${encodeURIComponent(from)}`}
      prefetch={false}
      className={css.button}
    >
      Create note
    </Link>
  );
}
