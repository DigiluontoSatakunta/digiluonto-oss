import { gql } from "@apollo/client";

export const RATING_QUERY_BY_ID = gql`
  query SurveyEvents($id: ID!) {
    events(where: { type: "rating", id: $id }) {
      id
      data
      uid
      place {
        id
      }
      journey {
        id
      }
    }
  }
`;

export const RATING_QUERY = gql`
  query SurveyEvents {
    events(where: { type: "rating" }) {
      id
      data
      uid
      place {
        id
      }
      journey {
        id
      }
    }
  }
`;

export const QUIZ_QUERY = gql`
  query SurveyEvents {
    events(where: { type: "quiz" }) {
      id
      data
      uid
      place {
        id
      }
      journey {
        id
      }
    }
  }
`;

export const BADGE_EVENTS_QUERY = gql`
  query SurveyEvents($uid: String) {
    events(where: { type: "contentOpened", uid: $uid }) {
      id
      data
      uid
      place {
        id
        name
        order
        cover {
          id
          url
          formats
        }
      }
      journey {
        id
        name
        cover {
          id
          url
          formats
        }
        places {
          id
        }
      }
    }
  }
`;
