import { create } from 'zustand';
import type { Note } from '@/types/note';

interface NoteStore {
  notes: Note[];
  selectedNote: Note | null;
  setNotes: (notes: Note[]) => void;
  removeNote: (id: string) => void;
  setSelectedNote: (note: Note) => void;
  clearSelectedNote: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  notes: [],
  selectedNote: null,
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
}));
