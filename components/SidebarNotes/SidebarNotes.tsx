'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import css from './SidebarNotes.module.css';
import { NOTE_TAGS } from '@/types/note';

const ALL_TAGS = ['All', ...NOTE_TAGS];

export default function SidebarNotes() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const buildHref = (tag: string) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    if (tag !== 'All') {
      params.set('tag', tag);
    }

    const query = params.toString();
    return query ? `/notes?${query}` : '/notes';
  };

  return (
    <ul className={css.menuList}>
      {ALL_TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={buildHref(tag)} prefetch={false} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
