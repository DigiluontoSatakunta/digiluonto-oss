import { gql } from "@apollo/client";

export const PORI_LUONTOKOHTEET = gql`
  query luontokohteet {
    PoriLuontokohteet_luontokohteet {
      features
    }
  }
`;
