import {gql, useQuery, useLazyQuery} from "@apollo/client";

export const GET_MY_TOP_JOURNEYS = gql`
  query MyTopJourneys {
    events(where: {type_eq: "journeyStarted", journey_null: false}) {
      journey {
        id
        name
        ownerGroup {
          id
        }
      }
    }
  }
`;

export const GET_MY_JOURNEYS = gql`
  query MyJourneys {
    journeys(sort: "name", publicationState: PREVIEW) {
      id
      name
      route
      geoJSON
      published_at
      places {
        id
        name
        order
      }
    }
  }
`;

const JOURNEY_PARTS = gql`
  fragment JourneyParts on Journey {
    id
    name
    excerpt
    accessibility
    allowRating
    audioLoop
    calculateDistance
    createdAt
    description
    difficulty
    distance
    duration
    elevation
    expirationDate
    featured
    geoJSON
    groupSize
    order
    public
    publishDate
    published_at
    radius
    showNextPlace
    showPlacesInJourneysArea
    targetGroup
    updatedAt
    route
    gpx {
      id
      url
      name
    }
    places(sort: "order:asc") {
      id
      name
      order
    }
    cover {
      id
      name
      url
      createdAt
      formats
    }
    audioGuide {
      id
      name
      url
      createdAt
    }
    links {
      id
      name
      url
      type
    }
    tags {
      id
      name
    }
  }
`;

export const GET_MY_JOURNEY = gql`
  ${JOURNEY_PARTS}
  query MyJourney($id: ID!) {
    journey(id: $id, publicationState: PREVIEW) {
      ...JourneyParts
    }
  }
`;

export const CREATE_JOURNEY_MUTATION = gql`
  ${JOURNEY_PARTS}
  mutation CREATE_JOURNEY_MUTATION($input: createJourneyInput!) {
    createJourney(input: $input) {
      journey {
        ...JourneyParts
      }
    }
  }
`;

export const UPDATE_JOURNEY_MUTATION = gql`
  mutation UPDATE_JOURNEY_MUTATION($input: updateJourneyInput!) {
    updateJourney(input: $input) {
      journey {
        id
      }
    }
  }
`;

export const PUBLISH_JOURNEY_MUTATION = gql`
  mutation PUBLISH_JOURNEY_MUTATION($input: updateJourneyInput!) {
    updateJourney(input: $input) {
      journey {
        id
        published_at
      }
    }
  }
`;

export const useMyJourneys = () => {
  const {data, loading, error} = useQuery(GET_MY_JOURNEYS);

  return {
    journeys: data?.journeys,
    loading,
    error,
  };
};

export const useMyJourney = id => {
  const {data, loading, error} = useQuery(GET_MY_JOURNEY, {
    variables: {
      id,
    },
  });

  return {
    journey: data?.journey,
    loading,
    error,
  };
};

export const useMyJourneyLazily = () => {
  const [getMyJourneyLazily, {data, loading, error}] =
    useLazyQuery(GET_MY_JOURNEY);

  return [getMyJourneyLazily, {data, loading, error}];
};

export const useMyTopJourneys = () => {
  const {data, loading, error} = useQuery(GET_MY_TOP_JOURNEYS);

  return {
    events: data?.events,
    loading,
    error,
  };
};
