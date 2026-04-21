import { api } from './api';
import type { Note, NotesResponse } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UpdateMePayload {
  username: string;
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
  params: FetchNotesParams = {},
): Promise<NotesResponse> {
  const { data } = await api.get<RawNotesResponse>('/notes', {
    params,
  });

  return normalizeNotesResponse(data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<RawNote>(`/notes/${id}`);
  return normalizeNote(data);
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<RawNote>('/notes', payload);
  return normalizeNote(data);
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<RawNote>(`/notes/${id}`);
  return normalizeNote(data);
}

export async function register(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
  return normalizeUser(data);
}

export async function login(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/login', payload);
  return normalizeUser(data);
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<SessionResponse>('/auth/session');
  return Boolean(data?.success);
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return normalizeUser(data);
}

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const { data } = await api.patch<User>('/users/me', payload);
  return normalizeUser(data);
}
