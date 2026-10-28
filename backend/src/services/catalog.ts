import { booksData } from '../data/books';
import { Book } from '../types';

/**
 * Catalog service: read-only access to the book catalog.
 */
const catalog: ReadonlyArray<Book> = booksData.map((book, index) => ({
  id: String(index + 1),
  ...book,
}));

// O(1) lookups by id instead of a linear scan on every `book(id)` request.
const catalogById = new Map(catalog.map((book) => [book.id, book]));

/**
 * Returns catalog books, optionally filtered by a case-insensitive title match.
 */
export const getBooks = (title?: string | null): ReadonlyArray<Book> => {
  const query = title?.trim().toLowerCase();
  if (!query) return catalog;
  return catalog.filter((book) => book.title.toLowerCase().includes(query));
};

export const getBookById = (id: string): Book | null => catalogById.get(id) ?? null;
