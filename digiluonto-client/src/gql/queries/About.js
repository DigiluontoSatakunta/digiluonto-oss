import { gql } from "@apollo/client";

export const ABOUT_QUERY = gql`
  query AboutPage($locale: String) {
    about(locale: $locale) {
      id
      title
      content
    }
  }
`;
