import React from "react";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
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

export const MultiplePoisFab = () => {
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
      to={"/places-in-location"}

    >
      <FormatListBulletedIcon />
    </Fab>
  );
};
