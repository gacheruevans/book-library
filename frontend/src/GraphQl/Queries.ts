import { gql } from "@apollo/client";

export const LOAD_BOOKS = gql`
    query getAllBooks {
        books {
            title
            coverPhotoURL
            author
            readingLevel
        }
    }
`;
export const LOAD_READING_LIST = gql`
    query getReadingList {
        readinglistbooks {
            id
            title
            author
            readingLevel
        }
    }
`;