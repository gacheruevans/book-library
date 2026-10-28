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


export const LOAD_USERS = gql`
  query GetUsers($role: UserRole) {
    users(role: $role) {
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

export const LOAD_READING_GROUPS = gql`
  query GetReadingGroups($readingLevel: String) {
    readingGroups(readingLevel: $readingLevel) {
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
        email
        age
        avatarUrl
      }
    }
  }
`;

export const LOAD_STUDENT_ASSIGNED_BOOKS = gql`
  query GetStudentAssignedBooks($studentId: ID) {
    studentAssignedBooks(studentId: $studentId) {
      id
      title
      author
      readingLevel
      coverPhotoURL
    }
  }
`;

export const LOAD_STUDENT_PROGRESS = gql`
  query GetStudentProgress($studentId: ID!) {
    studentProgress(studentId: $studentId) {
      bookId
      status
      updatedAt
    }
  }
`;