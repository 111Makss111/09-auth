'use client';

import css from './SearchBox.module.css';

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      name="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={css.input}
      placeholder="Search notes"
      aria-label="Search notes"
    />
  );
}
