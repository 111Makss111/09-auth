import { create } from 'zustand';
import type { CreateNotePayload } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';

const initialDraft: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  notes: Note[];
  selectedNote: Note | null;
  draft: CreateNotePayload;
  setNotes: (notes: Note[]) => void;
  removeNote: (id: string) => void;
  setSelectedNote: (note: Note) => void;
  clearSelectedNote: () => void;
  updateDraft: (payload: Partial<CreateNotePayload>) => void;
  resetDraft: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  notes: [],
  selectedNote: null,
  draft: initialDraft,
  setNotes: (notes) =>
    set({
      notes,
    }),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote:
        state.selectedNote?.id === id ? null : state.selectedNote,
    })),
  setSelectedNote: (note) =>
    set({
      selectedNote: note,
    }),
  clearSelectedNote: () =>
    set({
      selectedNote: null,
    }),
  updateDraft: (payload) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...payload,
      },
    })),
  resetDraft: () =>
    set({
      draft: initialDraft,
    }),
}));
