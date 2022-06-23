import React from "react";
import { makeStyles } from "@material-ui/core/";
import { ErrorOutline } from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    flex: "1 0 auto",
    display: "flex",
    "flex-direction": "column",
    "justify-content": "center",
    "align-items": "center",
    "text-align": "center",
  },
  iconButton: {
    "font-size": "20vw",
  },
}));

export default function Error404({ location }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ErrorOutline className={classes.iconButton} />
      <h2>Page {location.pathname} not found</h2>
    </div>
  );
}
