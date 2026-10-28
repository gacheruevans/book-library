import test from 'node:test';
import assert from 'node:assert/strict';
import { getBooks, getBookById } from './catalog';
import {
  getReadingList,
  addToReadingList,
  removeFromReadingList,
  resetReadingList,
  DuplicateBookError,
} from './readingList';

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

test('Reading list service', async (t) => {
  resetReadingList();

  await t.test('starts with an empty list', () => {
    assert.deepEqual(getReadingList(), []);
  });

  await t.test('adds a book and generates a unique ID', () => {
    const updated = addToReadingList({
      title: 'Test Book One',
      author: 'Jane Doe',
      readingLevel: 'A',
      coverPhotoURL: 'assets/image1.webp',
    });
    assert.equal(updated.length, 1);
    assert.equal(updated[0].title, 'Test Book One');
    assert.ok(typeof updated[0].id === 'string' && updated[0].id.length > 0);
  });

  await t.test('prevents adding duplicate books', () => {
    assert.throws(
      () => {
        addToReadingList({
          title: 'Test Book One',
          author: 'Jane Doe',
          readingLevel: 'A',
        });
      },
      DuplicateBookError
    );
  });

  await t.test('removes book by id', () => {
    const current = getReadingList();
    const idToRemove = current[0].id;
    const afterDelete = removeFromReadingList(idToRemove);
    assert.ok(afterDelete !== null);
    assert.equal(afterDelete?.length, 0);
  });

  await t.test('returns null when removing non-existent id', () => {
    const res = removeFromReadingList('does-not-exist');
    assert.equal(res, null);
  });
});
