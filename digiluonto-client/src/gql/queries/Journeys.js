import { gql } from "@apollo/client";

const JOURNEY_PARTS = gql`
  fragment JourneyParts on Journey {
    id
    name
    locale
    localizations {
      id
      locale
    }
    showNextPlace
    description
    cover {
      id
      url
      formats
    }
    links {
      id
      type
      name
      url
    }
    audioLoop
    audioGuide {
      url
    }
    ownerGroup {
      id
      name
      logo {
        id
        url
        formats
      }
    }
    order
    publishDate
    expirationDate
    allowRating
    groupSize
    difficulty
    category
    duration
    distance
    calculateDistance
    elevation
    targetGroup
    accessibility
    published_at
  }
`;

const PLACE_PARTS = gql`
  fragment PlaceParts on Place {
    id
    name
    description
    order
    publicContent
    public
    content
    allowRating
    geoJSON
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
    published_at
  }
`;

export const JOURNEYBYID = gql`
  ${PLACE_PARTS}
  ${JOURNEY_PARTS}
  query JourneyById($id: ID!, $publicationState: PublicationState) {
    journey(id: $id, publicationState: $publicationState) {
      ...JourneyParts
      places(sort: "order:asc") {
        ...PlaceParts
      }
    }
  }
`;

export const NEARMEJOURNEYS = gql`
  query NearMeJourneys(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
    $limit: Int
  ) {
    journeysByLocation(
      limit: $limit
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      id
      name
      excerpt
      cover {
        id
        url
        formats
      }
      ownerGroup {
        id
        name
        logo {
          id
          url
          formats
        }
      }
    }
  }
`;

export const EXPERIENCES = gql`
  query Experiences(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
    $limit: Int
  ) {
    findGroupJourneysByLocation(
      limit: $limit
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      id
      name
      excerpt
      cover {
        id
        url
        formats
      }
      ownerGroup {
        id
        name
        logo {
          id
          url
          formats
        }
      }
    }
  }
`;

export const OTHERJOURNEYS = gql`
  query OtherExperiences(
    $latitude: Float!
    $longitude: Float!
    $distance: Int!
    $group: String
    $locale: String
    $limit: Int
  ) {
    findOtherJourneysByLocation(
      limit: $limit
      location: {
        latitude: $latitude
        longitude: $longitude
        distance: $distance
      }
      where: { group_eq: $group, locale_eq: $locale }
    ) {
      id
      name
      excerpt
      cover {
        id
        url
        formats
      }
      ownerGroup {
        id
        name
        logo {
          id
          url
          formats
        }
      }
    }
  }
`;

export const FEATUREDJOURNEYS = gql`
  query FeaturedJourneys(
    $sort: String
    $featured: Boolean
    $locale: String
    $now: String
  ) {
    journeys(
      sort: $sort
      locale: $locale
      publicationState: LIVE
      where: {
        publishDate_lt: $now
        _or: [{ expirationDate_null: true }, { expirationDate_gte: $now }]
        featured_eq: $featured
        public_eq: true
      }
    ) {
      id
      name
      excerpt
      cover {
        id
        url
        formats
      }
      ownerGroup {
        id
        name
        logo {
          id
          url
          formats
        }
      }
    }
  }
`;

export const GROUPJOURNEYS = gql`
  query JourneysByGroupId(
    $sort: String
    $group: String
    $locale: String
    $now: String
  ) {
    journeys(
      sort: $sort
      locale: $locale
      publicationState: LIVE
      where: {
        publishDate_lte: $now
        expirationDate_gte: $now
        _or: [{ ownerGroup: $group }, { commonGroups: { id: $group } }]
      }
    ) {
      id
      name
      excerpt
      cover {
        id
        url
        formats
      }
      ownerGroup {
        id
        name
        logo {
          id
          url
          formats
        }
      }
    }
  }
`;
