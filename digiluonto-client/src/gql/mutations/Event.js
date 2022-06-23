import { gql } from "@apollo/client";

export const SENDEVENT = gql`
  mutation ($input: createEventInput) {
    createEvent(input: $input) {
      event {
        type
        data
        id
        local
        place {
          id
          name
        }
        journey {
          id
          name
        }
        group {
          id
          name
        }
      }
    }
  }
`;
