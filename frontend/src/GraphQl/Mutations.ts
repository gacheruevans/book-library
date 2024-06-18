import {gql} from '@apollo/client';

export const CREATE_READING_LIST = gql`
    mutation addBook(
        $title: String! 
        $author: String! 
        $readingLevel: String!
    ) {
        addBook(
            book: {
            title:  $title,
            author:  $author,
            readingLevel: $readingLevel}
        ) {
            title
            author
            readingLevel
        }
    }
`;

export const DELETE_FROM_READING_LIST = gql`
    mutation deleteBook(
        $id: ID!
    ) {
        deleteBook(id: $id) {
            title
            author
            readingLevel
        }
    }
`;