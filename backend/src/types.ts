/**
 * Shared domain types for the backend.
 */

/** A book exactly as it appears in the static seed data (no id yet). */
export interface RawBook {
  title: string;
  author: string;
  coverPhotoURL: string;
  readingLevel: string;
}

/** A catalog book exposed via the API. Has a stable, deterministic id. */
export interface Book extends RawBook {
  id: string;
}

export type UserRole = 'TEACHER' | 'STUDENT';

export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;               // Specific to students (e.g. 5)
  readingGroupId?: string;    // Student's assigned group id
}

export interface ReadingGroup {
  id: string;
  name: string;
  teacherId: string;
  minAge: number;
  maxAge: number;
  ageRangeLabel: string;      // e.g. "4–5 yrs"
  readingLevel: string;       // e.g. "B"
  description?: string;
  bookIds: string[];          // IDs of assigned books
  studentIds: string[];       // IDs of enrolled students
}

export interface StudentBookProgress {
  studentId: string;
  bookId: string;
  status: ReadingStatus;
  updatedAt: string;
}

export interface CreateReadingGroupInput {
  name: string;
  minAge?: number;
  maxAge?: number;
  readingLevel?: string;
  description?: string;
}
