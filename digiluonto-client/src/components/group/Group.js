import { useQuery } from "@apollo/client";
import { GROUPBYID } from "../../gql/queries/Group.js";

export function useGroup(id) {
  const { data } = useQuery(GROUPBYID, {
    variables: { id },
    fetchPolicy: "cache-first",
  });

  return data?.group;
}
