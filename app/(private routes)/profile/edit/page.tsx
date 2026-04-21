'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import css from './page.module.css';
import Loader from '@/components/Loader/Loader';
import { getMe, updateMe } from '@/lib/api/clientApi';
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

  return 'Unable to update the profile.';
};

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    initialData: user ?? undefined,
  });

  const updateMeMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['auth', 'me'], updatedUser);
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
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') ?? '').trim();

    updateMeMutation.mutate({ username });
  };

  if (meQuery.isPending || !meQuery.data) {
    return <Loader />;
  }

  const avatarSrc = meQuery.data.avatar || '/default-avatar.svg';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatarSrc}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={meQuery.data.username}
              required
            />
          </div>

          <p>Email: {meQuery.data.email}</p>

          {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateMeMutation.isPending}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
