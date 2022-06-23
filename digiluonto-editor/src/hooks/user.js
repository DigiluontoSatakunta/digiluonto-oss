import {gql, useQuery} from "@apollo/client";

export const AUTHENTICATE_USER_QUERY = gql`
  query AUTHENTICATE_USER_QUERY {
    self {
      id
      username
      email
      group {
        id
        name
      }
    }
  }
`;

export const useUser = () => {
  const {data, loading, error} = useQuery(AUTHENTICATE_USER_QUERY, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  return {
    user: data?.self,
    loading,
    error,
  };
};
