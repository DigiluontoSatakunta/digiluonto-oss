import {gql, useQuery} from "@apollo/client";

export const GET_TAGS = gql`
  query Taglist {
    tags(sort: "name", locale: "fi") {
      id
      name
    }
  }
`;

export const useTags = () => {
  const {data, loading, error} = useQuery(GET_TAGS);

  return {
    tags: data?.tags,
    loading,
    error,
  };
};
