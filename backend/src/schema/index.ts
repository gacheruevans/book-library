export const typeDefs = `#graphql
  enum UserRole {
    TEACHER
    STUDENT
  }

  enum ReadingStatus {
    WANT_TO_READ
    READING
    COMPLETED
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    coverPhotoURL: String!
    readingLevel: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    age: Int
    avatarUrl: String
    readingGroupId: String
    readingGroup: ReadingGroup
  }

  type ReadingGroup {
    id: ID!
    name: String!
    teacherId: String!
    minAge: Int!
    maxAge: Int!
    ageRangeLabel: String!
    readingLevel: String!
    description: String
    teacher: User
    books: [Book!]!
    students: [User!]!
  }

  type StudentBookProgress {
    studentId: ID!
    bookId: ID!
    status: ReadingStatus!
    updatedAt: String!
  }

  type Query {
    books(title: String): [Book!]!
    book(id: ID!): Book
    users(role: UserRole): [User!]!
    user(id: ID!): User
    readingGroups(readingLevel: String): [ReadingGroup!]!
    readingGroup(id: ID!): ReadingGroup
    studentAssignedBooks(studentId: ID): [Book!]!
    studentProgress(studentId: ID!): [StudentBookProgress!]!
  }

  type Mutation {
    login(email: String!): User!
    createReadingGroup(
      name: String!
      minAge: Int
      maxAge: Int
      readingLevel: String
      description: String
    ): ReadingGroup!
    deleteReadingGroup(id: ID!): Boolean!
    assignBookToReadingGroup(groupId: ID!, bookId: ID!): ReadingGroup!
    removeBookFromReadingGroup(groupId: ID!, bookId: ID!): ReadingGroup!
    assignStudentToReadingGroup(groupId: ID!, studentId: ID!): ReadingGroup!
    updateStudentBookStatus(studentId: ID!, bookId: ID!, status: ReadingStatus!): StudentBookProgress!
  }
`;
