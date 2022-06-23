import { gql } from "@apollo/client";

export const PLACESONMAP = gql`
  query PlacesOnMap(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
  ) {
    placesOnMap(
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      name
      id
      icon
      ownerGroup {
        id
        name
      }
      geoJSON
      tags {
        id
        name
      }
    }
  }
`;
