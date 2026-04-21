'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthRoutesLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthRoutesLayout({ children }: AuthRoutesLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
