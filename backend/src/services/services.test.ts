import test from 'node:test';
import assert from 'node:assert/strict';
import { getBooks, getBookById } from './catalog';
import {
  getTierByAge,
  getTierByLevel,
  getCoincidingLevel,
  getCoincidingAgeRange,
} from '../utils/ageLevelLadder';
import {
  getUsers,
  getUserById,
  getUserByEmail,
  loginUser,
  resetUsers,
} from './userService';
import {
  getReadingGroups,
  getReadingGroupById,
  createReadingGroup,
  deleteReadingGroup,
  assignBookToReadingGroup,
  removeBookFromReadingGroup,
  assignStudentToReadingGroup,
  getAssignedBooksForStudent,
  updateStudentBookStatus,
  getStudentProgress,
  resetReadingGroups,
} from './readingGroupService';

test('Catalog service', async (t) => {
  await t.test('returns all books with stable IDs', () => {
    const books = getBooks();
    assert.ok(books.length > 0, 'Catalog should have books');
    assert.equal(books[0].id, '1', 'First book should have id 1');
    assert.ok(books[0].title, 'First book should have title');
    assert.ok(books[0].author, 'First book should have author');
  });

  await t.test('filters books by title case-insensitively', () => {
    const results = getBooks('curious');
    assert.ok(results.length > 0, 'Should find matching books');
    for (const book of results) {
      assert.match(book.title.toLowerCase(), /curious/);
    }
  });

  await t.test('finds book by id in O(1)', () => {
    const book = getBookById('1');
    assert.ok(book !== null);
    assert.equal(book?.id, '1');

    const notFound = getBookById('non-existent-id-9999');
    assert.equal(notFound, null);
  });
});

test('Age & Level Ladder', async (t) => {
  await t.test('coincides age 2-3 yrs with Level A', () => {
    assert.equal(getCoincidingLevel(2), 'A');
    assert.equal(getCoincidingLevel(3), 'A');
    const tier = getTierByAge(3);
    assert.equal(tier.readingLevel, 'A');
    assert.equal(tier.ageRangeLabel, '2–3 yrs');
  });

  await t.test('coincides age 4-5 yrs with Level B', () => {
    assert.equal(getCoincidingLevel(4), 'B');
    assert.equal(getCoincidingLevel(5), 'B');
    const tier = getTierByAge(5);
    assert.equal(tier.readingLevel, 'B');
    assert.equal(tier.ageRangeLabel, '4–5 yrs');
  });

  await t.test('coincides Level A to 2-3 yrs and Level B to 4-5 yrs', () => {
    const rangeA = getCoincidingAgeRange('A');
    assert.equal(rangeA.minAge, 2);
    assert.equal(rangeA.maxAge, 3);

    const rangeB = getCoincidingAgeRange('B');
    assert.equal(rangeB.minAge, 4);
    assert.equal(rangeB.maxAge, 5);
  });

  await t.test('coincides subsequent levels C through J systematically', () => {
    assert.equal(getTierByLevel('C')?.ageRangeLabel, '6–7 yrs');
    assert.equal(getTierByLevel('D')?.ageRangeLabel, '8–9 yrs');
    assert.equal(getTierByLevel('E')?.ageRangeLabel, '10–11 yrs');
    assert.equal(getTierByLevel('J')?.ageRangeLabel, '16+ yrs');
  });
});

test('User service', async (t) => {
  resetUsers();

  await t.test('retrieves seeded teachers and students', () => {
    const teachers = getUsers('TEACHER');
    assert.ok(teachers.length >= 2);
    const students = getUsers('STUDENT');
    assert.ok(students.length >= 5);
  });

  await t.test('logs in valid user by email', () => {
    const user = loginUser('clara@ello.com');
    assert.equal(user.name, 'Ms. Clara Vance');
    assert.equal(user.role, 'TEACHER');
  });

  await t.test('throws when logging in with unknown email', () => {
    assert.throws(() => {
      loginUser('unknown@user.com');
    }, /not found/);
  });

  await t.test('finds user by id and email', () => {
    const user = getUserByEmail('leo@student.ello.com');
    assert.ok(user !== undefined);
    assert.equal(user?.name, 'Leo Brooks');
    assert.equal(user?.age, 5);

    const byId = getUserById('user-student-2');
    assert.equal(byId?.email, 'leo@student.ello.com');
  });
});

test('Reading group service', async (t) => {
  resetReadingGroups();
  resetUsers();

  await t.test('retrieves pre-seeded reading groups with age-level coincidence', () => {
    const groups = getReadingGroups();
    assert.ok(groups.length >= 5);

    const groupA = groups.find((g) => g.readingLevel === 'A');
    assert.ok(groupA);
    assert.equal(groupA?.ageRangeLabel, '2–3 yrs');

    const groupB = groups.find((g) => g.readingLevel === 'B');
    assert.ok(groupB);
    assert.equal(groupB?.ageRangeLabel, '4–5 yrs');
  });

  await t.test('filters reading groups by level', () => {
    const levelBGroups = getReadingGroups('B');
    assert.ok(levelBGroups.length > 0);
    for (const g of levelBGroups) {
      assert.equal(g.readingLevel, 'B');
    }
  });

  await t.test('creates reading group auto-coinciding age 2-3 with Level A', () => {
    const newGroup = createReadingGroup({
      name: 'Toddler Bookworms',
      minAge: 2,
      maxAge: 3,
      description: 'Morning story session for toddlers',
    });
    assert.equal(newGroup.readingLevel, 'A');
    assert.equal(newGroup.ageRangeLabel, '2–3 yrs');
    assert.ok(newGroup.id.startsWith('group-'));
  });

  await t.test('creates reading group auto-coinciding Level B with 4-5 yrs', () => {
    const newGroup = createReadingGroup({
      name: 'Kindergarten Readers',
      readingLevel: 'B',
      description: 'Afternoon circle',
    });
    assert.equal(newGroup.minAge, 4);
    assert.equal(newGroup.maxAge, 5);
    assert.equal(newGroup.ageRangeLabel, '4–5 yrs');
  });

  await t.test('assigns and removes books from a group', () => {
    const group = getReadingGroupById('group-2');
    assert.ok(group);
    assignBookToReadingGroup('group-2', '1');
    assert.ok(group?.bookIds.includes('1'));

    removeBookFromReadingGroup('group-2', '1');
    assert.ok(!group?.bookIds.includes('1'));
  });

  await t.test('assigns student to a reading group', () => {
    const group = assignStudentToReadingGroup('group-1', 'user-student-2');
    assert.ok(group.studentIds.includes('user-student-2'));
  });

  await t.test('fetches assigned books for a student', () => {
    const books = getAssignedBooksForStudent('user-student-2');
    assert.ok(Array.isArray(books));
  });

  await t.test('updates and queries student reading status progress', () => {
    const progress = updateStudentBookStatus('user-student-2', '19', 'COMPLETED');
    assert.equal(progress.status, 'COMPLETED');

    const allProgress = getStudentProgress('user-student-2');
    const record = allProgress.find((p) => p.bookId === '19');
    assert.equal(record?.status, 'COMPLETED');
  });

  await t.test('deletes a reading group', () => {
    const tempGroup = createReadingGroup({ name: 'Temp Group', minAge: 4, maxAge: 5 });
    const deleted = deleteReadingGroup(tempGroup.id);
    assert.equal(deleted, true);
    assert.equal(getReadingGroupById(tempGroup.id), undefined);
  });
});
