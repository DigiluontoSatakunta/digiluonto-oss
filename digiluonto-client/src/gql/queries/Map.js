import { gql } from "@apollo/client";

export const JOURNEYSBYLOCATION = gql`
  query JourneysByLocation(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
  ) {
    journeysByLocation(
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      id
      name
      geoJSON
      excerpt
      route
      showNextPlace
      published_at
      order
      showPlacesInJourneysArea
      radius
      ownerGroup {
        id
      }
      cover {
        id
        url
        formats
      }
      places {
        id
        name
        publicContent
        createdAt
        published_at
        public
        geoJSON
        order
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
  }
`;

export const PLACESBYLOCATION = gql`
  query PlacesByLocation(
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
      description
      token
      publicContent
      createdAt
      published_at
      public
      geoJSON
      order
      journeys {
        id
      }
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

export const FIREPLACESBYLOCATION = gql`
  query FireplacesByLocation($fireplaceCounty: ID) {
    Tulikartta_fireplaces(FireplaceCounty: $fireplaceCounty) {
      features {
        geometry {
          coordinates
        }
        properties {
          name
          tyyppi
          maakunta
        }
      }
    }
  }
`;

export const SERVICEPLACESBYLOCATION = gql`
  query ServicePlacesByLocation(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $locale: String
  ) {
    servicesByLocation(
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { locale_eq: $locale }
    ) {
      name
      description
      latitude
      longitude
      cover {
        id
        url
        formats
      }
      icon
      homepage
    }
  }
`;
