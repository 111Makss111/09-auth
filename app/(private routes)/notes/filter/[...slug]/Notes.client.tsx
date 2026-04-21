'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from '../../page.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api/clientApi';
import { notesQueryKeys } from '@/lib/query';

type NotesClientProps = {
  initialPage: number;
  initialSearch?: string;
  initialTag?: string;
};

export default function NotesClient({
  initialPage,
  initialSearch = '',
  initialTag = '',
}: NotesClientProps) {
  const params = useParams<{ slug?: string[] }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeTag = Array.isArray(params.slug)
    ? decodeURIComponent(params.slug.at(-1) ?? '')
    : '';
  const tag = routeTag || initialTag;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState(initialSearch);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const currentQueryString = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery) {
      params.set('search', debouncedSearchQuery);
    } else {
      params.delete('search');
    }

    if (currentPage > 1) {
      params.set('page', String(currentPage));
    } else {
      params.delete('page');
    }

    const nextQueryString = params.toString();

    if (nextQueryString !== currentQueryString) {
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname);
    }
  }, [
    currentPage,
    currentQueryString,
    debouncedSearchQuery,
    pathname,
    router,
    searchParams,
  ]);

  const notesQuery = useQuery({
    queryKey: notesQueryKeys.list({
      search: debouncedSearchQuery,
      page: currentPage,
      tag,
    }),
    queryFn: () =>
      fetchNotes({
        search: debouncedSearchQuery,
        page: currentPage,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const currentPathWithQuery = currentQueryString
    ? `${pathname}?${currentQueryString}`
    : pathname;

  if (notesQuery.isPending && !notesQuery.data) {
    return <Loader />;
  }

  if (notesQuery.isError || !notesQuery.data) {
    return <p>Unable to load notes.</p>;
  }

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />
        <Link
          href={`/notes/action/create?from=${encodeURIComponent(currentPathWithQuery)}`}
          prefetch={false}
          className={css.button}
        >
          Create note
        </Link>
      </div>

      <NoteList notes={notesQuery.data.notes} />

      <Pagination
        currentPage={notesQuery.data.page}
        totalPages={notesQuery.data.totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
