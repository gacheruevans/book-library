import { v4 as uuidv4 } from 'uuid';
import { AddBookInput, ReadingListItem } from '../types';

/**
 * Reading-list service: owns the in-memory reading list and all mutations to it.
 * NOTE: State is still in memory, so the list resets when the server restarts.
 */
let readingList: ReadingListItem[] = [];

/** Thrown when a book that is already on the list is added again. */
export class DuplicateBookError extends Error {
  constructor(title: string) {
    super(`"${title}" is already on the reading list.`);
    this.name = 'DuplicateBookError';
  }
}

const sameBook = (a: Pick<AddBookInput, 'title' | 'author'>, b: Pick<AddBookInput, 'title' | 'author'>) =>
  a.title.trim().toLowerCase() === b.title.trim().toLowerCase() &&
  a.author.trim().toLowerCase() === b.author.trim().toLowerCase();

export const getReadingList = (): ReadingListItem[] => [...readingList];

/**
 * Adds a book to the reading list and returns the updated list.
 */
export const addToReadingList = (input: AddBookInput): ReadingListItem[] => {
  if (readingList.some((item) => sameBook(item, input))) {
    throw new DuplicateBookError(input.title);
  }

  const item: ReadingListItem = {
    id: uuidv4(),
    title: input.title,
    author: input.author,
    readingLevel: input.readingLevel,
    coverPhotoURL: input.coverPhotoURL ?? null,
  };

  readingList = [...readingList, item];
  return getReadingList();
};

/**
 * Removes an entry by id. Returns the updated list, or `null` if no entry
 * with that id exists (preserves the original API contract).
 */
export const removeFromReadingList = (id: string): ReadingListItem[] | null => {
  const exists = readingList.some((item) => item.id === id);
  if (!exists) return null;

  readingList = readingList.filter((item) => item.id !== id);
  return getReadingList();
};

/** Test helper: resets state between test cases. */
export const resetReadingList = (): void => {
  readingList = [];
};
