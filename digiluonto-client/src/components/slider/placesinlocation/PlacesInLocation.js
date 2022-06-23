import React from "react";
import { Link, Redirect } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Grid, makeStyles, Typography } from "@material-ui/core/";

import { SliderTitle } from "../../slider/SliderTitle";
import { useGroup } from "../../group/GroupContext";
import { ListItemPlaces } from "../nearme/NearMe";

const useStyles = makeStyles(theme => ({
  sliderGrid: {
    margin: 0,
    flex: "1 0 auto",
    maxWidth: "100%",
    display: "grid",
  },
  mapSliderContent: {
    flex: 1,
    zIndex: 5,
    overflow: "auto",
    background: "#fff",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  paper: {
    padding: theme.spacing(1),
  },
  listItem: {
    color: "#000000de",
  },
  skeletonListItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  subTitle: {
    paddingTop: theme.spacing(2),
  },
  limitedLengthDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "4",
    "-webkit-box-orient": "vertical",
  },
  listItemAvatar: {
    position: "relative",
  },
  placeAvatar: {
    "& img": {
      objectPosition: "50% 0%",
    },
  },
  placeholder: {
    position: "absolute",
    height: 200,
    zIndex: 2,
    top: -55,
    left: 0,
    right: 0,
  },
  skeletonCards: {
    marginTop: "8px",
    gap: "8px",
    [theme.breakpoints.down("xs")]: {
      overflow: "hidden",
      maxWidth: "100%",
      display: "flex",
      flexWrap: "nowrap",
    },
  },
  skeletonCard: {
    minHeight: 265,
    minWidth: "100%",
    display: "flex",
    backgroundSize: "cover",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  skeletonDots: {
    position: "relative",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
      1
    )}px`,
    [theme.breakpoints.down("xs")]: {
      boxSizing: "border-box",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  skeletonDot: {
    width: "1rem",
    fontSize: "9px",
    margin: "0 .25rem 4px",
    lineHeight: 1,
    textDecoration: "none",
    color: "#bdbdbd",
    background: "#bdbdbd",
    borderRadius: "100px",
    height: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  lock: {
    top: 0,
    right: theme.spacing(1),
    position: "absolute",
    fontSize: "1.2em",
    color: "#212121",
  },
}));

export const PlacesInLocation = ({
  placesInLocation,
  unCheckedTags,
  setActivePlace,
  userIsInLocation,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const group = useGroup();

  const filteredPlaces = placesInLocation?.filter(place =>
    place?.tags?.map(tag => tag.id).some(t => !unCheckedTags.includes(t))
  );

  return (
    <>
      <Helmet>
        <title>
          {t("Places in location")} | {group?.name}
        </title>
        <meta name="description" content={group?.welcome} />
      </Helmet>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle
        title={t("Places in location")}
        className={classes.mapSliderTitle}
        likeable={false}
      />
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ overflowY: "auto" }}>
            <Typography variant="h6" className={classes.subTitle}>
              {t("Places")}
            </Typography>
            {filteredPlaces && filteredPlaces.length ? (
              <ListItemPlaces
                key="list-item-pois"
                places={filteredPlaces}
                alwaysOpen={true}
                setActivePlace={setActivePlace}
                userIsInLocation={userIsInLocation}
                fromPlacesInLocation={true}
              />
            ) : (
              <Redirect to="/map" />
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};
