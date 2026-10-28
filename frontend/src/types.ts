export interface Book {
  id: string;
  title: string;
  author: string;
  coverPhotoURL: string;
  readingLevel: string;
}

export interface ReadingListItem {
  id: string;
  title: string;
  author: string;
  readingLevel: string;
  coverPhotoURL?: string | null;
}

export interface BooksQueryData {
  books: Book[];
}

export interface ReadingListQueryData {
  readinglistbooks: ReadingListItem[];
}
