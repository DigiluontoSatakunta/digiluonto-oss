import { gql } from "@apollo/client";

export const NEARMEPLACES = gql`
  query NearMePlaces(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
  ) {
    placesByLocation(
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      id
      name
      token
      publicContent
      public
      geoJSON
      cover {
        id
        url
        formats
      }
      tags {
        id
        name
      }
    }
  }
`;
