import { gql } from "@apollo/client";

export const ALL_TAGS = gql`
  query Tags($sort: String, $locale: String) {
    tags(sort: $sort, locale: $locale) {
      id
      name
    }
  }
`;

export const TAGS_USED_BY_GROUP = gql`
  query TagsByGroupId($id: ID!, $sort: String, $locale: String) {
    group(id: $id) {
      places {
        tags(sort: $sort, where: { locale_eq: $locale }) {
          id
          name
        }
      }
    }
  }
`;
