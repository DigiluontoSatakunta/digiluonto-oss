import { gql } from "@apollo/client";

export const HELP_QUERY = gql`
  query Help($locale: String) {
    help(locale: $locale) {
      id
      title
      content
    }
  }
`;
