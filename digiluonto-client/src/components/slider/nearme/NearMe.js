import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Skeleton } from "@material-ui/lab/";
import {
  LocationOn,
  LocationOff,
  Lock as LockIcon,
  Room as RoomIcon,
  Check as CheckIcon,
} from "@material-ui/icons/";

import {
  Grid,
  List,
  Chip,
  Avatar,
  Divider,
  ListItem,
  makeStyles,
  Typography,
  ListItemText,
  ListItemAvatar,
  Button,
} from "@material-ui/core/";

import { SliderTitle } from "../../slider/SliderTitle";
import { ContentAvatarsWithMetaData } from "../../slider/content/ContentAvatars";
import { NearByJourneyCards } from "../../cards/NearByJourneyCards";
import { useLocation } from "../../location/LocationContext";
import { useGroup } from "../../group/GroupContext";

import { LocationDialog } from "../../location/LocationDialog";

import { NEARMEPLACES } from "../../../gql/queries/NearMePlaces";

const useStyles = makeStyles(theme => ({
  sliderGrid: {
    margin: 0,
    flex: "1 0 auto",
    maxWidth: "100%",
    display: "grid",
    marginTop: 48,
    marginBottom: 56,
  },
  mapSliderContent: {
    height: "100%",
    flex: 1,
    zIndex: 5,
    overflowY: "auto",
    background: "#fff",
    boxShadow: "none",
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
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  skeletonCards: {
    marginTop: 8,
    gap: 8,
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
  lockIcon: {
    width: "1rem",
    color: "#737373",
    marginRight: 5,
  },
  lockText: {
    fontSize: ".8rem",
  },
  lockInfoBox: {
    display: "block",
    justifyContent: "flex-end",
    alignItems: "center",
    float: "right",
    width: "auto",
    fontSize: ".86em",
    color: "#737373",
    padding: 4,
    gap: "4px",
  },
  seeOnMapButton: {
    minWidth: "40px",
    height: "40px",
    borderRadius: "50%",
    background: theme.palette.primary.main,
  },
  fab: {
    color: theme.palette.icon.main,
  },
}));

export const NearMe = ({
  setActivePlace,
  unCheckedTags,
  setActivePlaceBounds,
}) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { location } = useLocation();
  const group = useGroup();

  // TODO: Ei käytetä local storagea sovelluksen sisäiseen tilan hallintaan.
  // vaan ladataan local storagesta vain kun tulee sovelluksen refresh.
  const visited = localStorage.getItem("visitedPlaces" || []);

  const { data, loading, error, refetch } = useQuery(NEARMEPLACES, {
    variables: {
      latitude: parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE),
      longitude: parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE),
      distance: 4000,
      group: group?.id,
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    refetch({
      latitude: Number.parseFloat(location[0]),
      longitude: Number.parseFloat(location[1]),
    });
  }, [refetch, location]);

  if (loading) return <ListSkeleton />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  const filteredPlaces = data?.placesByLocation?.filter(place =>
    place?.tags?.map(tag => tag.id).some(t => !unCheckedTags?.includes(t))
  );

  return (
    <>
      <Helmet>
        <title>
          {t("Near Me")} | {group?.name}
        </title>
        <meta name="description" content={group?.welcome} />
        <body class="map-with-slider-layout" />
      </Helmet>
      <LocationDialog />
      {/* <Link to="/map" className={classes.placeholder}></Link> */}
      <SliderTitle
        title={t("Near Me")}
        className={classes.mapSliderTitle}
        likeable={false}
      />
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ overflowY: "auto" }}>
            <Typography variant="h6" style={{ marginBottom: 12 }}>
              {t("Journeys & activies")}
            </Typography>
            <NearByJourneyCards fromHome={false} />
            <Divider light />
            <div className={classes.lockInfoBox}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <LockIcon className={classes.lockIcon} />
                <Typography className={classes.lockText}>
                  {t("Available in location")}
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CheckIcon className={classes.lockIcon} />
                <Typography className={classes.lockText}>
                  {t("Visited in location")}
                </Typography>
              </div>
            </div>
            <Typography variant="h6" className={classes.subTitle}>
              {t("Destinations")}
            </Typography>
            {filteredPlaces && filteredPlaces.length ? (
              <ListItemPlaces
                key="list-item-pois"
                places={filteredPlaces}
                setActivePlace={setActivePlace}
                setActivePlaceBounds={setActivePlaceBounds}
                visited={visited}
              />
            ) : (
              <p>{t("There is no places near by")}</p>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export const ListItemPlaces = React.memo(
  ({
    places,
    journeyCover,
    setActivePlace,
    setActivePlaceBounds,
    openJourneyContent,
    userIsInLocation,
    alwaysOpen = false,
    fromPlacesInLocation = false,
    visited,
  }) => {
    return (
      <List style={{ paddingTop: 0 }}>
        {places?.map(place => (
          <ListItemPlace
            key={place.id}
            place={place}
            journeyCover={journeyCover}
            setActivePlace={setActivePlace}
            setActivePlaceBounds={setActivePlaceBounds}
            alwaysOpen={alwaysOpen}
            userIsInLocation={userIsInLocation}
            fromPlacesInLocation={fromPlacesInLocation}
            openJourneyContent={openJourneyContent}
            visited={visited}
          />
        ))}
      </List>
    );
  }
);

const ListItemPlace = ({
  place,
  setActivePlace,
  journeyCover,
  setActivePlaceBounds,
  alwaysOpen,
  userIsInLocation,
  fromPlacesInLocation,
  openJourneyContent,
  visited,
}) => {
  const classes = useStyles();
  const [redirect, setRedirect] = useState();
  const { t } = useTranslation();
  const coverPhoto = place?.cover?.formats?.thumbnail?.url
    ? place.cover.formats.thumbnail.url
    : journeyCover || null;

  const handleMapCheck = place => {
    if (!userIsInLocation) setActivePlace(place);
    setActivePlaceBounds([
      [
        place.geoJSON.geometry.coordinates[1],
        place.geoJSON.geometry.coordinates[0],
      ],
    ]);
  };
  const handleClick = place => {
    if (
      alwaysOpen ||
      place?.publicContent ||
      openJourneyContent?.places?.find(
        journeyPlace => journeyPlace.id === place.id
      )
    ) {
      if (!userIsInLocation) setActivePlace(place);
      if (!alwaysOpen) {
        setActivePlaceBounds([
          [
            place.geoJSON.geometry.coordinates[1],
            place.geoJSON.geometry.coordinates[0],
          ],
        ]);
      }
      setRedirect(true);
      //history.push(`/places/${place.id}`);
    }
  };

  const placeName = (
    <>
      {place.name}{" "}
      {place?.published_at === null && (
        <Chip
          label={t("draft")}
          size="small"
          style={{ fontSize: 12, height: 20 }}
        />
      )}
    </>
  );

  return (
    <>
      {redirect && (
        <Redirect
          to={{
            pathname: `/places/${place.id}`,
            state: { fromPlacesInLocation: fromPlacesInLocation },
          }}
        />
      )}
      <ListItem
        key={place.id}
        className={classes.listItem}
        onClick={() => handleClick(place)}
        style={{ paddingLeft: 8 }}
        component={Link}
        to={`/places/${place.id}`}
      >
        <ListItemAvatar className={classes.listItemAvatar}>
          <>
            {coverPhoto ? (
              <Avatar
                className={classes.placeAvatar}
                alt={place.name}
                src={`${process.env.REACT_APP_STRAPI}${coverPhoto}`}
              ></Avatar>
            ) : (
              <Avatar>{place.public ? <LocationOn /> : <LocationOff />}</Avatar>
            )}
            {!place.publicContent && userIsInLocation
              ? null
              : alwaysOpen
              ? null
              : openJourneyContent?.places?.find(
                  journeyPlace => journeyPlace.id === place.id
                )
              ? null
              : !place.publicContent && <LockIcon className={classes.lock} />}
          </>
        </ListItemAvatar>
        <ListItemText
          primary={placeName}
          secondaryTypographyProps={{ component: "div" }}
          secondary={<ContentAvatarsWithMetaData place={place} />}
        />
        {!alwaysOpen && (
          <div className={classes.seeOnMap}>
            <Button
              className={classes.seeOnMapButton}
              color="primary"
              size="small"
              aria-label="Katso kartalta"
              onClick={() => {
                handleMapCheck(place);
              }}
              to="/map"
              component={Link}
            >
              {" "}
              {visited && visited.includes(place?.id) ? (
                <CheckIcon className={classes.fab} fontSize="small" />
              ) : (
                <RoomIcon className={classes.fab} fontSize="small" />
              )}
            </Button>
          </div>
        )}
      </ListItem>
    </>
  );
};

const ListSkeleton = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle title={t("Near Me")} className={classes.mapSliderTitle} />
      <div className={classes.mapSliderContent} style={{ height: "100%" }}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <div className={classes.skeletonCards}>
              <Skeleton
                className={classes.skeletonCard}
                variant="rect"
                width={306}
                height={265}
              />
            </div>
            <div className={classes.skeletonDots}>
              <Skeleton
                className={classes.dot}
                variant="circle"
                width={16}
                height={16}
              />
              <Skeleton
                className={classes.skeletonDot}
                variant="circle"
                width={16}
                height={16}
              />
              <Skeleton
                className={classes.dot}
                variant="circle"
                width={16}
                height={16}
              />
            </div>
            <Divider light />
            <List>
              {[1, 2, 3].map((item, i) => (
                <ListItem key={i} style={{ padding: 8 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <Skeleton
                        variant="circle"
                        animation="wave"
                        width={40}
                        height={40}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <div>
                    <span>
                      <Skeleton variant="text" width="70vw" animation="wave" />
                    </span>
                    <span>
                      <Skeleton
                        variant="text"
                        width="70vw"
                        height={10}
                        animation="wave"
                      />
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
