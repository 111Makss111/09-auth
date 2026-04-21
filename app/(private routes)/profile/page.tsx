import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import css from './page.module.css';
import { getMe } from '@/lib/api/serverApi';
import type { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and manage your NoteHub profile information.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View and manage your NoteHub profile information.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Profile | NoteHub',
    description: 'View and manage your NoteHub profile information.',
  },
};

export default async function ProfilePage() {
  const cookieHeader = (await cookies()).toString();
  let user: User;

  try {
    user = await getMe(cookieHeader);
  } catch {
    redirect('/sign-in');
  }

  const avatarSrc = user.avatar || '/default-avatar.svg';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link
            href="/profile/edit"
            prefetch={false}
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
