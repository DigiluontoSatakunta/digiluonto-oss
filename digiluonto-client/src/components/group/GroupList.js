import { useQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/";

import { GROUPLIST } from "../../gql/queries/Group.js";

const useStyles = makeStyles(theme => ({
  groupList: {
    marginBottom: 0,
    display: "flex",
    flexWrap: "wrap",
  },
  groupLink: {
    paddingRight: theme.spacing(1),
    lineHeight: 1.8,
    whiteSpace: "nowrap",
    color: "#717171",
    textDecoration: "revert",
  },
}));

export const GroupList = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GROUPLIST, {
    fetchPolicy: "cache-first",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <p className={classes.groupList}>
      {data?.groups.map(group => (
        <a
          className={classes.groupLink}
          key={group.id}
          href={`${process.env.REACT_APP_ENDPOINT}?oid=${group.id}`}
        >
          {group.name}
        </a>
      ))}
    </p>
  );
};
