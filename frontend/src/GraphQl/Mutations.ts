import { gql } from '@apollo/client';



export const LOGIN_MUTATION = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      name
      email
      role
      age
      avatarUrl
      readingGroupId
      readingGroup {
        id
        name
        ageRangeLabel
        readingLevel
      }
    }
  }
`;

export const CREATE_READING_GROUP = gql`
  mutation CreateReadingGroup(
    $name: String!
    $minAge: Int
    $maxAge: Int
    $readingLevel: String
    $description: String
  ) {
    createReadingGroup(
      name: $name
      minAge: $minAge
      maxAge: $maxAge
      readingLevel: $readingLevel
      description: $description
    ) {
      id
      name
      teacherId
      minAge
      maxAge
      ageRangeLabel
      readingLevel
      description
      teacher {
        id
        name
      }
      books {
        id
        title
        author
        readingLevel
        coverPhotoURL
      }
      students {
        id
        name
      }
    }
  }
`;

export const DELETE_READING_GROUP = gql`
  mutation DeleteReadingGroup($id: ID!) {
    deleteReadingGroup(id: $id)
  }
`;

export const ASSIGN_BOOK_TO_GROUP = gql`
  mutation AssignBookToReadingGroup($groupId: ID!, $bookId: ID!) {
    assignBookToReadingGroup(groupId: $groupId, bookId: $bookId) {
      id
      name
      readingLevel
      books {
        id
        title
        readingLevel
      }
    }
  }
`;

export const REMOVE_BOOK_FROM_GROUP = gql`
  mutation RemoveBookFromReadingGroup($groupId: ID!, $bookId: ID!) {
    removeBookFromReadingGroup(groupId: $groupId, bookId: $bookId) {
      id
      name
      books {
        id
        title
      }
    }
  }
`;

export const ASSIGN_STUDENT_TO_GROUP = gql`
  mutation AssignStudentToReadingGroup($groupId: ID!, $studentId: ID!) {
    assignStudentToReadingGroup(groupId: $groupId, studentId: $studentId) {
      id
      name
      students {
        id
        name
      }
    }
  }
`;

export const UPDATE_STUDENT_BOOK_STATUS = gql`
  mutation UpdateStudentBookStatus($studentId: ID!, $bookId: ID!, $status: ReadingStatus!) {
    updateStudentBookStatus(studentId: $studentId, bookId: $bookId, status: $status) {
      bookId
      status
      updatedAt
    }
  }
`;