import { gql } from "@apollo/client";

export const SENDMESSAGE = gql`
  mutation ($input: createMessageInput) {
    createMessage(input: $input) {
      message {
        id
      }
    }
  }
`;
