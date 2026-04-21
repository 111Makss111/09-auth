'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

type ModalProps = {
  children: ReactNode;
  closeHref?: string;
  onClose?: () => void;
};

export default function Modal({
  children,
  closeHref = '/notes',
  onClose,
}: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.push(closeHref);
  };

  useEffect(() => {
    const closeModal = () => {
      if (onClose) {
        onClose();
        return;
      }

      router.push(closeHref);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeHref, onClose, router]);

  return (
    <div className={css.backdrop} onClick={handleClose} role="presentation">
      <div
        className={css.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
