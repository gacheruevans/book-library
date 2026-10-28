import { gql } from '@apollo/client';

export const LOAD_BOOKS = gql`
  query GetAllBooks($title: String) {
    books(title: $title) {
      id
      title
      coverPhotoURL
      author
      readingLevel
    }
  }
`;

export const LOAD_READING_LIST = gql`
  query GetReadingList {
    readinglistbooks {
      id
      title
      author
      readingLevel
      coverPhotoURL
    }
  }
`;