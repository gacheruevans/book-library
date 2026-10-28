import { gql } from '@apollo/client';

export const CREATE_READING_LIST = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $readingLevel: String!
    $coverPhotoURL: String
  ) {
    addBook(
      book: {
        title: $title
        author: $author
        readingLevel: $readingLevel
        coverPhotoURL: $coverPhotoURL
      }
    ) {
      id
      title
      author
      readingLevel
      coverPhotoURL
    }
  }
`;

export const DELETE_FROM_READING_LIST = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      title
      author
      readingLevel
      coverPhotoURL
    }
  }
`;