import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.wrapper}>
      <div className={css.spinner} aria-hidden="true" />
      <p className={css.label}>Loading...</p>
    </div>
  );
}
