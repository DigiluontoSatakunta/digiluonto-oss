import React from "react";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(3),
    left: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
}));

export const CurrentPoiFab = ({ currentPlace, setOpenMultipleCard }) => {
  const classes = useStyles();
  const theme = useTheme();

  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";

  return (
    <Fab
      color={color}
      aria-label="center"
      className={classes.fab}
      component={Link}
      to={`/places/${currentPlace.id}`}
    >
      <InfoIcon />
    </Fab>
  );
};
