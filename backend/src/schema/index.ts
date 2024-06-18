export const typeDefs = `#graphql
  type Book {
    title: String
    author: String
    coverPhotoURL: String
    readingLevel: String
  }

  type ReadingList {
    id: ID
    title: String
    author: String
    readingLevel: String
  }

  type Query {
    books: [Book],
    book(id: ID!): Book,
    readinglistbooks: [ReadingList],
  }

  type Mutation {
    addBook(book: AddBookToReadingList!): [ReadingList!]
    deleteBook(id: ID!): [ReadingList]
  }

  input AddBookToReadingList {
    title: String!,
    author: String!,
    readingLevel: String!
  }
`;
