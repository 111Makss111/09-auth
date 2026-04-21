import Link from 'next/link';
import css from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  basePath?: string;
  search?: string;
  tag?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  basePath = '/notes',
  search = '',
  tag = '',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (onPageChange) {
    return (
      <ul className={css.pagination}>
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? css.active : undefined}
          >
            <button
              type="button"
              className={css.pageButton}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    if (tag) {
      params.set('tag', tag);
    }

    if (page > 1) {
      params.set('page', String(page));
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <ul className={css.pagination}>
      {pages.map((page) => (
        <li
          key={page}
          className={page === currentPage ? css.active : undefined}
        >
          <Link href={buildHref(page)} prefetch={false}>
            {page}
          </Link>
        </li>
      ))}
    </ul>
  );
}
