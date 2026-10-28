import { getBooks, getBookById } from '../services/catalog';
import {
  getUsers,
  getUserById,
  loginUser,
} from '../services/userService';
import {
  getReadingGroups,
  getReadingGroupById,
  createReadingGroup,
  deleteReadingGroup,
  assignBookToReadingGroup,
  removeBookFromReadingGroup,
  assignStudentToReadingGroup,
  getAssignedBooksForStudent,
  getStudentProgress,
  updateStudentBookStatus,
} from '../services/readingGroupService';
import {
  User,
  ReadingGroup,
  UserRole,
  CreateReadingGroupInput,
  ReadingStatus,
  Book,
} from '../types';

export const resolvers = {
  Query: {
    books: (_: unknown, args: { title?: string | null }) => {
      return getBooks(args.title);
    },
    book: (_: unknown, args: { id: string }) => {
      return getBookById(args.id);
    },
    users: (_: unknown, args: { role?: UserRole }) => {
      return getUsers(args.role);
    },
    user: (_: unknown, args: { id: string }) => {
      return getUserById(args.id) ?? null;
    },
    readingGroups: (_: unknown, args: { readingLevel?: string }) => {
      return getReadingGroups(args.readingLevel);
    },
    readingGroup: (_: unknown, args: { id: string }) => {
      return getReadingGroupById(args.id) ?? null;
    },
    studentAssignedBooks: (_: unknown, args: { studentId?: string }) => {
      return getAssignedBooksForStudent(args.studentId);
    },
    studentProgress: (_: unknown, args: { studentId: string }) => {
      return getStudentProgress(args.studentId);
    },
  },

  Mutation: {
    login: (_: unknown, args: { email: string }) => {
      return loginUser(args.email);
    },
    createReadingGroup: (_: unknown, args: CreateReadingGroupInput) => {
      return createReadingGroup(args);
    },
    deleteReadingGroup: (_: unknown, args: { id: string }) => {
      return deleteReadingGroup(args.id);
    },
    assignBookToReadingGroup: (_: unknown, args: { groupId: string; bookId: string }) => {
      return assignBookToReadingGroup(args.groupId, args.bookId);
    },
    removeBookFromReadingGroup: (_: unknown, args: { groupId: string; bookId: string }) => {
      return removeBookFromReadingGroup(args.groupId, args.bookId);
    },
    assignStudentToReadingGroup: (_: unknown, args: { groupId: string; studentId: string }) => {
      return assignStudentToReadingGroup(args.groupId, args.studentId);
    },
    updateStudentBookStatus: (
      _: unknown,
      args: { studentId: string; bookId: string; status: ReadingStatus }
    ) => {
      return updateStudentBookStatus(args.studentId, args.bookId, args.status);
    },
  },

  User: {
    readingGroup: (user: User) => {
      return user.readingGroupId ? getReadingGroupById(user.readingGroupId) ?? null : null;
    },
  },

  ReadingGroup: {
    teacher: (group: ReadingGroup) => {
      return getUserById(group.teacherId) ?? null;
    },
    books: (group: ReadingGroup) => {
      return group.bookIds
        .map((id) => getBookById(id))
        .filter((b): b is Book => b !== null);
    },
    students: (group: ReadingGroup) => {
      return group.studentIds
        .map((id) => getUserById(id))
        .filter((u): u is User => u !== undefined);
    },
  },
};
