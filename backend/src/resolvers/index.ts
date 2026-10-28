import { getBooks, getBookById } from '../services/catalog';
import {
  getReadingList,
  addToReadingList,
  removeFromReadingList,
} from '../services/readingList';
import { AddBookInput } from '../types';

export const resolvers = {
  Query: {
    books: (_: unknown, args: { title?: string | null }) => {
      return getBooks(args.title);
    },
    book: (_: unknown, args: { id: string }) => {
      return getBookById(args.id);
    },
    readinglistbooks: () => {
      return getReadingList();
    },
  },

  Mutation: {
    addBook: (_: unknown, { book }: { book: AddBookInput }) => {
      return addToReadingList(book);
    },
    deleteBook: (_: unknown, args: { id: string }) => {
      return removeFromReadingList(args.id);
    },
  },
};
