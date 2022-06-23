import React, { memo, useEffect, useRef } from "react";
import Fab from "@material-ui/core/Fab";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GpsOffIcon from '@material-ui/icons/GpsOff';
const L = require("leaflet");

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    zIndex: "400",
  },
  iconButton: {
    color: theme.palette.icon.main,
  },
}));

export const CenterFab = memo(({ backToCenter, followUser }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fabRef = useRef(null);

  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";

  useEffect(() => {
    L.DomEvent.disableClickPropagation(fabRef.current);
  });
  return (
    <Fab ref={fabRef} color={color} aria-label="center" className={classes.fab}>
      {followUser ?
      <GpsFixedIcon
        className={classes.iconButton}
        onClick={() => backToCenter()}
      />
      :
      <GpsOffIcon
        className={classes.iconButton}
        onClick={() => backToCenter()}
      />
    }
    </Fab>
  );
});
