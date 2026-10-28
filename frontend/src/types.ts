export interface Book {
  id: string;
  title: string;
  author: string;
  coverPhotoURL: string;
  readingLevel: string;
}



export type UserRole = 'TEACHER' | 'STUDENT';

export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;
  readingGroupId?: string;
  readingGroup?: ReadingGroup | null;
}

export interface ReadingGroup {
  id: string;
  name: string;
  teacherId: string;
  minAge: number;
  maxAge: number;
  ageRangeLabel: string;
  readingLevel: string;
  description?: string;
  teacher?: User | null;
  books: Book[];
  students: User[];
}

export interface StudentBookProgress {
  bookId: string;
  status: ReadingStatus;
  updatedAt: string;
}

export interface BooksQueryData {
  books: Book[];
}

export interface UsersQueryData {
  users: User[];
}

export interface ReadingGroupsQueryData {
  readingGroups: ReadingGroup[];
}

export interface StudentAssignedBooksQueryData {
  studentAssignedBooks: Book[];
}

export interface StudentProgressQueryData {
  studentProgress: StudentBookProgress[];
}
