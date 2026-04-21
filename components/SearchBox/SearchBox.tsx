'use client';

import { FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from './SearchBox.module.css';

export default function SearchBox() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const normalizedValue = String(formData.get('search') ?? '').trim();

    if (normalizedValue) {
      params.set('search', normalizedValue);
    } else {
      params.delete('search');
    }

    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        defaultValue={searchParams.get('search') ?? ''}
        className={css.input}
        placeholder="Search notes"
        aria-label="Search notes"
      />
    </form>
  );
}
