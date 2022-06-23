import {gql, useQuery} from "@apollo/client";

export const GET_SITES = gql`
  query SiteList {
    sites {
      id
      name
      visible
      firstData
      timezone
      interval
      latitude
      longitude
    }
  }
`;

export const useSites = () => {
  const {data, loading, error} = useQuery(GET_SITES);

  return {
    sites: data?.sites,
    loading,
    error,
  };
};
