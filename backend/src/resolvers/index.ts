import { booksData } from '../data/books';
import { readingData } from '../data/readinglist';
import { v4 as uuidv4 } from 'uuid';

interface Book {
  id: string;
  title: string;
  author: string;
  readingLevel: string;
}

type ReadingList = Book[];

// Explicitly type readingData
const typedReadingData: ReadingList = readingData as ReadingList;

// Utility function to get a book by ID
const getBookById = (id: string): Book | null => {
  return typedReadingData.find(book => book.id === id) || null;
};

// Add a new book to the reading list
const addBookToReadingList = async (book: Book): Promise<ReadingList> => {
  try {
    // Generate a unique ID for the new book
    book.id = uuidv4();

    // Add the new book to the reading list
    typedReadingData.push(book);

    // Here you should add code to update the data file if needed

    return typedReadingData;
  } catch (error) {
    console.error('Error adding book to reading list:', error);
    throw new Error('Failed to add book to reading list');
  }
};

// Delete a book from the reading list
const deleteBookFromReadingList = (id: string): ReadingList | null => {
  try {
    // Find the index of the book with the given ID
    const index = typedReadingData.findIndex(book => book.id === id);

    // If the book with the given ID is not found, return null
    if (index === -1) {
      return null;
    }

    // Remove the book from the reading list
    readingData.splice(index, 1);

    // Here you should add code to update the data file if needed

    return readingData; // Return the updated reading list array
  } catch (error) {
    console.error('Error deleting book from reading list:', error);
    throw new Error('Failed to delete book from reading list');
  }
};

// Resolver definition
export const resolvers = {
  Query: {
    books: () => booksData,
    book: (_: unknown, args: { id: string }) => getBookById(args.id),
    readinglistbooks: () => [...readingData],
  },

  Mutation: {
    addBook: async (_: unknown, { book }: { book: Book }): Promise<ReadingList> => {
      return addBookToReadingList(book);
    },
    deleteBook: (_: unknown, args: { id: string }): ReadingList | null => {
      return deleteBookFromReadingList(args.id);
    },
  },
};
