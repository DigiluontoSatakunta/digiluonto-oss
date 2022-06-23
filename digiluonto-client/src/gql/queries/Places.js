import { gql } from "@apollo/client";

const PARTS = gql`
  fragment Parts on Place {
    id
    name
    token
    content
    publicContent
    geoJSON
    description
    allowRating
    locale
    ar {
      modelFile {
        url
      }
      background {
        id
        url
        formats
      }
    }
    publishDate
    expirationDate
    tags {
      id
      name
    }
    localizations {
      id
      locale
    }
    cover {
      id
      url
      formats
    }
    journeys {
      id
      name
      description
      cover {
        id
        url
        formats
      }
    }
    questions {
      id
      question
      answers {
        id
        answer
        correctAnswer
      }
      explanation
    }
    gallery {
      url
      formats
    }
    links {
      id
      type
      name
      url
    }
    audioGuide {
      url
    }
    qr
    published_at
  }
`;

export const PLACEBYID = gql`
  ${PARTS}
  query Place($id: ID!, $publicationState: PublicationState) {
    place(id: $id, publicationState: $publicationState) {
      ...Parts
    }
  }
`;
