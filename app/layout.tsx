import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import { checkSession, getMe } from '@/lib/api/serverApi';
import { mergeCookieHeader } from '@/lib/sessionCookies';
import type { User } from '@/types/user';

export const metadata: Metadata = {
  title: {
    default: 'NoteHub',
    template: '%s | NoteHub',
  },
  description:
    'Secure NoteHub app with authentication, profile management, and private notes.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default async function RootLayout({
  children,
  modal,
}: RootLayoutProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  let initialUser: User | null = null;

  if (cookieHeader) {
    try {
      const sessionResponse = await checkSession(cookieHeader);
      const hasSession = Boolean(sessionResponse.data?.success);

      if (hasSession) {
        const nextCookieHeader = mergeCookieHeader(
          cookieHeader,
          sessionResponse.headers['set-cookie'],
        );

        initialUser = await getMe(nextCookieHeader || cookieHeader);
      }
    } catch {
      initialUser = null;
    }
  }

  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <AuthProvider initialUser={initialUser}>
            <Header />
            {children}
            <Footer />
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
