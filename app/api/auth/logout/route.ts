import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    if (cookieHeader) {
      await api.post('/auth/logout', null, {
        headers: {
          Cookie: cookieHeader,
        },
      });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    } else {
      logErrorResponse({ message: (error as Error).message });
    }
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 },
  );
}
