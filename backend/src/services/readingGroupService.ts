import { v4 as uuidv4 } from 'uuid';
import { ReadingGroup, CreateReadingGroupInput, Book, StudentBookProgress, ReadingStatus } from '../types';
import { getTierByAge, getTierByLevel, getCoincidingAgeRange } from '../utils/ageLevelLadder';
import { getBookById } from './catalog';
import { assignStudentGroup, getUserById } from './userService';

const INITIAL_GROUPS: ReadingGroup[] = [
  {
    id: 'group-1',
    name: 'Little Sprouts',
    teacherId: 'user-teacher-1',
    minAge: 2,
    maxAge: 3,
    ageRangeLabel: '2–3 yrs',
    readingLevel: 'A',
    description: 'Nursery & toddler early book exploration focusing on rhymes and sensory concepts.',
    bookIds: ['4', '5'],
    studentIds: ['user-student-1'],
  },
  {
    id: 'group-2',
    name: 'Early Explorers',
    teacherId: 'user-teacher-1',
    minAge: 4,
    maxAge: 5,
    ageRangeLabel: '4–5 yrs',
    readingLevel: 'B',
    description: 'Emergent readers expanding phonics, basic sight words, and engaging picture stories.',
    bookIds: ['19', '26'],
    studentIds: ['user-student-2'],
  },
  {
    id: 'group-3',
    name: 'Story Builders',
    teacherId: 'user-teacher-1',
    minAge: 6,
    maxAge: 7,
    ageRangeLabel: '6–7 yrs',
    readingLevel: 'C',
    description: 'Early fluent readers transitioning into simple chapter books and deeper comprehension.',
    bookIds: ['7', '10', '12'],
    studentIds: ['user-student-3'],
  },
  {
    id: 'group-4',
    name: 'Curious Investigators',
    teacherId: 'user-teacher-1',
    minAge: 8,
    maxAge: 9,
    ageRangeLabel: '8–9 yrs',
    readingLevel: 'D',
    description: 'Developing readers tackling mysteries, fantasy themes, and richer vocabulary.',
    bookIds: ['9', '15'],
    studentIds: ['user-student-4'],
  },
  {
    id: 'group-5',
    name: 'Book Voyagers',
    teacherId: 'user-teacher-2',
    minAge: 10,
    maxAge: 11,
    ageRangeLabel: '10–11 yrs',
    readingLevel: 'E',
    description: 'Intermediate readers exploring complex adventure stories, science, and world history.',
    bookIds: ['8', '11'],
    studentIds: ['user-student-5'],
  },
];

let readingGroups: ReadingGroup[] = JSON.parse(JSON.stringify(INITIAL_GROUPS));
let studentProgressRecords: StudentBookProgress[] = [
  {
    studentId: 'user-student-2',
    bookId: '19',
    status: 'READING',
    updatedAt: new Date().toISOString(),
  },
  {
    studentId: 'user-student-2',
    bookId: '26',
    status: 'WANT_TO_READ',
    updatedAt: new Date().toISOString(),
  },
];

export function resetReadingGroups(): void {
  readingGroups = JSON.parse(JSON.stringify(INITIAL_GROUPS));
  studentProgressRecords = [
    {
      studentId: 'user-student-2',
      bookId: '19',
      status: 'READING',
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'user-student-2',
      bookId: '26',
      status: 'WANT_TO_READ',
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function getReadingGroups(readingLevel?: string): ReadingGroup[] {
  if (readingLevel && readingLevel !== 'ALL') {
    const levelUpper = readingLevel.trim().toUpperCase();
    return readingGroups.filter((g) => g.readingLevel.toUpperCase() === levelUpper);
  }
  return readingGroups;
}

export function getReadingGroupById(id: string): ReadingGroup | undefined {
  return readingGroups.find((g) => g.id === id);
}

export function createReadingGroup(
  input: CreateReadingGroupInput,
  teacherId: string = 'user-teacher-1'
): ReadingGroup {
  let minAge = input.minAge;
  let maxAge = input.maxAge;
  let readingLevel = input.readingLevel?.trim().toUpperCase();
  let ageRangeLabel = '';

  // Synchronize Age and Reading Level so they strictly coincide
  if (minAge !== undefined && maxAge !== undefined) {
    const tier = getTierByAge(minAge);
    readingLevel = tier.readingLevel;
    ageRangeLabel = `${minAge}–${maxAge} yrs`;
  } else if (readingLevel) {
    const tier = getTierByLevel(readingLevel);
    if (tier) {
      minAge = tier.minAge;
      maxAge = tier.maxAge;
      ageRangeLabel = tier.ageRangeLabel;
    } else {
      const coinciding = getCoincidingAgeRange(readingLevel);
      minAge = coinciding.minAge;
      maxAge = coinciding.maxAge;
      ageRangeLabel = coinciding.ageRangeLabel;
    }
  } else {
    // Default fallback to Level B (4-5 yrs)
    minAge = 4;
    maxAge = 5;
    readingLevel = 'B';
    ageRangeLabel = '4–5 yrs';
  }

  const newGroup: ReadingGroup = {
    id: `group-${uuidv4()}`,
    name: input.name.trim(),
    teacherId,
    minAge,
    maxAge,
    ageRangeLabel,
    readingLevel,
    description: input.description?.trim(),
    bookIds: [],
    studentIds: [],
  };

  readingGroups.push(newGroup);
  return newGroup;
}

export function deleteReadingGroup(id: string): boolean {
  const index = readingGroups.findIndex((g) => g.id === id);
  if (index === -1) {
    return false;
  }
  readingGroups.splice(index, 1);
  return true;
}

export function assignBookToReadingGroup(groupId: string, bookId: string): ReadingGroup {
  const group = getReadingGroupById(groupId);
  if (!group) {
    throw new Error(`Reading group with ID "${groupId}" not found.`);
  }

  const book = getBookById(bookId);
  if (!book) {
    throw new Error(`Book with ID "${bookId}" not found in catalog.`);
  }

  if (!group.bookIds.includes(bookId)) {
    group.bookIds.push(bookId);
  }

  return group;
}

export function removeBookFromReadingGroup(groupId: string, bookId: string): ReadingGroup {
  const group = getReadingGroupById(groupId);
  if (!group) {
    throw new Error(`Reading group with ID "${groupId}" not found.`);
  }

  group.bookIds = group.bookIds.filter((id) => id !== bookId);
  return group;
}

export function assignStudentToReadingGroup(groupId: string, studentId: string): ReadingGroup {
  const group = getReadingGroupById(groupId);
  if (!group) {
    throw new Error(`Reading group with ID "${groupId}" not found.`);
  }

  const student = getUserById(studentId);
  if (!student || student.role !== 'STUDENT') {
    throw new Error(`Student with ID "${studentId}" not found.`);
  }

  if (!group.studentIds.includes(studentId)) {
    group.studentIds.push(studentId);
  }

  assignStudentGroup(studentId, groupId);
  return group;
}

export function getAssignedBooksForStudent(studentId?: string): Book[] {
  if (!studentId) return [];
  const student = getUserById(studentId);
  if (!student || !student.readingGroupId) return [];

  const group = getReadingGroupById(student.readingGroupId);
  if (!group) return [];

  return group.bookIds
    .map((bookId) => getBookById(bookId))
    .filter((b): b is Book => b !== null);
}

export function getStudentProgress(studentId: string): StudentBookProgress[] {
  return studentProgressRecords.filter((rec) => rec.studentId === studentId);
}

export function updateStudentBookStatus(
  studentId: string,
  bookId: string,
  status: ReadingStatus
): StudentBookProgress {
  const existing = studentProgressRecords.find(
    (rec) => rec.studentId === studentId && rec.bookId === bookId
  );

  if (existing) {
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const newRecord: StudentBookProgress = {
    studentId,
    bookId,
    status,
    updatedAt: new Date().toISOString(),
  };
  studentProgressRecords.push(newRecord);
  return newRecord;
}
