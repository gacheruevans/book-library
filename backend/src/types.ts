/**
 * Shared domain types for the backend.
 *
 * WHY: Previously the `Book` interface was declared inline inside the resolvers
 * file and did not match either the GraphQL schema (which had no `id` on Book)
 * or the raw data (which had `coverPhotoURL` but no `id`). Keeping a single
 * source of truth for these shapes lets the compiler catch drift between the
 * data layer, the resolvers and the schema.
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

/** An entry in the teacher's reading list. */
export interface ReadingListItem {
  /** Unique id of the reading-list entry (used to delete it). */
  id: string;
  title: string;
  author: string;
  readingLevel: string;
  coverPhotoURL?: string | null;
}

/** Payload accepted by the `addBook` mutation. */
export interface AddBookInput {
  title: string;
  author: string;
  readingLevel: string;
  coverPhotoURL?: string | null;
}
