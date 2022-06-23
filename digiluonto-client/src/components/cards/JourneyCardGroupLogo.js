import React from "react";
import { makeStyles, Typography } from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  cardGroupLogo: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    width: theme.spacing(12),
    height: "auto",
    filter: "brightness(0) invert(1) drop-shadow(3px 2px 3px #00000066)",
    zIndex: 1,
  },
  cardGroupName: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    textShadow: "3px 2px 3px #00000066",
  },
}));

export const JourneyCardGroupLogo = ({ group }) => {
  const classes = useStyles();

  const logoSrc = group?.logo?.formats?.small?.url
    ? `${process.env.REACT_APP_STRAPI}${group?.logo?.formats?.small?.url}`
    : null;

  if (group)
    return (
      <>
        {logoSrc ? (
          <img
            src={logoSrc}
            className={classes.cardGroupLogo}
            alt={group.name}
            title={group.name}
            data-cy="content-group"
          />
        ) : (
          <Typography
            variant="h6"
            component="h6"
            className={classes.cardGroupName}
            style={{ color: "#ffffff" }}
            data-cy="content-group"
          >
            {group.name}
          </Typography>
        )}
      </>
    );

  return null;
};
