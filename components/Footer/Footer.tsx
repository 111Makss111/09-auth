import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <span>NoteHub</span>
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          Next.js
        </a>
        <a href="https://vercel.com/" target="_blank" rel="noreferrer">
          Vercel
        </a>
      </div>
    </footer>
  );
}
