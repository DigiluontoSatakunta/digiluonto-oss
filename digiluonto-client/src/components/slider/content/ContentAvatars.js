import React from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { makeStyles, Avatar } from "@material-ui/core/";
import { AvatarGroup } from "@material-ui/lab/";
import { useLocation } from "../../location/LocationContext";
import { getDistance } from "geolib";
import {
  Android,
  Headset,
  Videocam,
  Bookmarks,
  CameraAlt,
  TextFields,
  HelpOutline,
  SportsEsports,
} from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  avatar: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: "#fafafa",
    "& svg": {
      width: "16px",
      height: "16px",
    },
  },
  largeAvatars: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export const ContentAvatars = ({ place }) => {
  return <Avatars place={place} largeSize={true} />;
};

export const ContentAvatarsWithMetaData = ({ place }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Avatars place={place} />
      <MetaData place={place} />
    </div>
  );
};

export const ContentMetaData = ({ place }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MetaData place={place} />
    </div>
  );
};

const Avatars = ({ largeSize, place }) => {
  const classes = useStyles();

  const contentTypes = place?.links ? place.links.map(links => links.type) : [];
  const types = [...new Set(contentTypes)];
  const sizeClass = largeSize ? classes.largeAvatars : "";
  const avatarClassName = clsx(classes.avatar, sizeClass);

  return (
    <div className={classes.root}>
      <AvatarGroup spacing={4}>
        {types?.map((type, i) => (
          <Avatar key={i} className={avatarClassName}>
            {type === "AUDIO" ? (
              <Headset />
            ) : type === "VIDEO" ? (
              <Videocam />
            ) : type === "TEXT" ? (
              <TextFields />
            ) : type === "IFRAME" ? (
              <Android />
            ) : type === "AR" ? (
              <Android />
            ) : type === "LINK" ? (
              <Bookmarks />
            ) : type === "IMAGE" ? (
              <CameraAlt />
            ) : type === "GAME" ? (
              <SportsEsports />
            ) : (
              <HelpOutline />
            )}
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
};

const MetaData = ({ place }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { location } = useLocation(); // React.useContext(LocationContext);

  const distance = getDistance(
    {
      latitude: place?.geoJSON.geometry.coordinates[1],
      longitude: place?.geoJSON.geometry.coordinates[0],
    },
    {
      latitude: location?.[0],
      longitude: location?.[1],
    }
  );

  const humanReadableDistance =
    distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;

  // const tags = place?.tags.map(tag => tag.name).join(", ");
  // , {t("tags")} {tags}
  return (
    <div className={classes.metadata}>
      {t("dist")} {humanReadableDistance}
    </div>
  );
};
