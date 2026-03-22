import { create } from "zustand";
import type { Book, Step4Chapter } from "@/types";

interface BookState {
  currentBook: Book | null;
  chapters: Step4Chapter[];
  setCurrentBook: (book: Book | null) => void;
  setChapters: (chapters: Step4Chapter[]) => void;
}

export const useBookStore = create<BookState>((set) => ({
  currentBook: null,
  chapters: [],
  setCurrentBook: (book) => set({ currentBook: book }),
  setChapters: (chapters) => set({ chapters }),
}));
