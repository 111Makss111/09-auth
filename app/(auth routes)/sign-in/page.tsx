'use client';

import { FormEvent, useState } from 'react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './page.module.css';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data?.response?.message === 'string'
        ? error.response.data.response.message
        : undefined;

    return responseMessage ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sign in. Please try again.';
};

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
      setErrorMessage('');
      router.replace('/profile');
      router.refresh();
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={loginMutation.isPending}
          >
            Log in
          </button>
        </div>

        {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}
      </form>
    </main>
  );
}
