import {gql, useQuery, useLazyQuery} from "@apollo/client";

export const GET_MY_TOP_PLACES = gql`
  query MyTopPlaces {
    events(where: {type_eq: "arrived", place_null: false}) {
      place {
        id
        name
        ownerGroup {
          id
        }
      }
    }
  }
`;

export const GET_MY_PLACES = gql`
  query MyPlaces {
    places(sort: "name", publicationState: PREVIEW) {
      id
      name
      geoJSON
      published_at
      journeys {
        id
        name
      }
    }
  }
`;

const PLACE_PARTS = gql`
  fragment PlaceParts on Place {
    id
    name
    description
    content
    createdAt
    updatedAt
    public
    publishDate
    published_at
    publicContent
    expirationDate
    token
    allowRating
    order
    geoJSON
    icon
    qr
    journeys {
      id
      name
    }
    gallery {
      id
      name
      url
      createdAt
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
    ar {
      id
      background {
        id
        name
        url
      }
      modelFile {
        id
        name
        url
      }
    }
    links {
      id
      name
      url
      type
    }
    questions {
      id
      question
      explanation
      answers {
        id
        answer
        correctAnswer
      }
    }
    tags {
      id
      name
    }
  }
`;

export const GET_MY_PLACE = gql`
  ${PLACE_PARTS}
  query MyPlace($id: ID!) {
    place(id: $id, publicationState: PREVIEW) {
      ...PlaceParts
    }
  }
`;

export const CREATE_PLACE_MUTATION = gql`
  ${PLACE_PARTS}
  mutation CREATE_PLACE_MUTATION($input: createPlaceInput!) {
    createPlace(input: $input) {
      place {
        ...PlaceParts
      }
    }
  }
`;

export const UPDATE_PLACE_MUTATION = gql`
  mutation UPDATE_PLACE_MUTATION($input: updatePlaceInput!) {
    updatePlace(input: $input) {
      place {
        id
      }
    }
  }
`;

export const PUBLISH_PLACE_MUTATION = gql`
  mutation PUBLISH_PLACE_MUTATION($input: updatePlaceInput!) {
    updatePlace(input: $input) {
      place {
        id
        published_at
      }
    }
  }
`;

export const useMyPlaces = () => {
  const {data, loading, error} = useQuery(GET_MY_PLACES);

  return {
    places: data?.places,
    loading,
    error,
  };
};

export const useMyPlace = id => {
  const {data, loading, error} = useQuery(GET_MY_PLACE, {
    variables: {
      id,
    },
  });

  return {
    place: data?.place,
    loading,
    error,
  };
};

export const useMyPlaceLazily = () => {
  const [getMyPlaceLazily, {data, loading, error}] = useLazyQuery(GET_MY_PLACE);

  return [getMyPlaceLazily, {data, loading, error}];
};

export const useMyTopPlaces = () => {
  const {data, loading, error} = useQuery(GET_MY_TOP_PLACES);

  return {
    events: data?.events,
    loading,
    error,
  };
};
