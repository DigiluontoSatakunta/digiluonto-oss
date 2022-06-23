import {gql, useQuery} from "@apollo/client";

export const GET_DATA = gql`
  query Data($id: Int!, $begin: String, $step: Step) {
    data(id: $id, begin: $begin, step: $step) {
      isoDate
      counts
    }
  }
`;

export const useSiteData = ({id, begin, step}) => {
  const {data, loading, error} = useQuery(GET_DATA, {
    variables: {
      id,
      begin,
      step,
    },
  });

  return {
    data: data?.data,
    loading,
    error,
  };
};
