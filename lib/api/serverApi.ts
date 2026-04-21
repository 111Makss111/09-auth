import { api } from './api';
import type { Note, NotesResponse } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

type RawNote = Partial<Note> & {
  _id?: string;
  created_at?: string;
  updated_at?: string;
};

type RawNotesResponse =
  | RawNote[]
  | {
      notes?: RawNote[];
      data?: RawNote[];
      page?: number;
      perPage?: number;
      totalPages?: number;
      totalItems?: number;
      total?: number;
    };

type SessionResponse = {
  success?: boolean;
};

const getHeaders = (cookieHeader: string) => ({
  headers: {
    Cookie: cookieHeader,
  },
});

const normalizeNote = (note: RawNote): Note => ({
  id: String(note.id ?? note._id ?? ''),
  title: note.title ?? '',
  content: note.content ?? '',
  tag: note.tag ?? 'Todo',
  createdAt: note.createdAt ?? note.created_at ?? '',
  updatedAt: note.updatedAt ?? note.updated_at ?? '',
});

const normalizeUser = (user: Partial<User>): User => ({
  email: user.email ?? '',
  username: user.username ?? '',
  avatar: user.avatar ?? '',
});

const normalizeNotesResponse = (payload: RawNotesResponse): NotesResponse => {
  if (Array.isArray(payload)) {
    return {
      notes: payload.map(normalizeNote),
      page: 1,
      perPage: payload.length,
      totalPages: 1,
      totalItems: payload.length,
    };
  }

  const rawNotes = Array.isArray(payload.notes)
    ? payload.notes
    : Array.isArray(payload.data)
      ? payload.data
      : [];

  return {
    notes: rawNotes.map(normalizeNote),
    page: Number(payload.page ?? 1),
    perPage: Number(payload.perPage ?? 12),
    totalPages: Number(payload.totalPages ?? 1),
    totalItems: Number(payload.totalItems ?? payload.total ?? rawNotes.length),
  };
};

export async function fetchNotes(
  params: FetchNotesParams,
  cookieHeader: string,
): Promise<NotesResponse> {
  const { data } = await api.get<RawNotesResponse>('/notes', {
    ...getHeaders(cookieHeader),
    params,
  });

  return normalizeNotesResponse(data);
}

export async function fetchNoteById(
  id: string,
  cookieHeader: string,
): Promise<Note> {
  const { data } = await api.get<RawNote>(
    `/notes/${id}`,
    getHeaders(cookieHeader),
  );
  return normalizeNote(data);
}

export async function getMe(cookieHeader: string): Promise<User> {
  const { data } = await api.get<User>('/users/me', getHeaders(cookieHeader));
  return normalizeUser(data);
}

export async function checkSession(cookieHeader: string): Promise<boolean> {
  const { data } = await api.get<SessionResponse>(
    '/auth/session',
    getHeaders(cookieHeader),
  );
  return Boolean(data?.success);
}
