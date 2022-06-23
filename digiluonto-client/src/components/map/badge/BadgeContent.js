import React, { useCallback, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BADGE_EVENTS_QUERY } from "../../../gql/queries/Events";
import { RATING_QUERY } from "../../../gql/queries/Events";

import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

import { SENDEVENT } from "../../../gql/mutations/Event";

import { Skeleton } from "@material-ui/lab/";
import {
  Container,
  CssBaseline,
  Typography,
  makeStyles,
  Paper,
  Card,
  CardContent,
  Box,
  CardMedia,
  Collapse,
  IconButton,
  CardActions,
  Grid,
} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import LinearProgress from "@mui/material/LinearProgress";
import { useGroup } from "../../group/GroupContext";
import placesImage from "../../../assets/avatar.png";
import { crawlers } from "../../../utils/crawlers";
import { useSettings } from "../../settings/SettingsContext";

import { BadgePlaceCards } from "../../cards/BadgePlaceCards";
const useStyles = makeStyles(theme => ({
  root: {
    flex: "1 0 auto",
    margin: 0,
    minWidth: "100%",
    padding: theme.spacing(3),
    marginBottom: 64,
  },

  paper: {
    marginTop: theme.spacing(2),
  },
  box: {
    width: "100%",
    margin: 0,
    padding: 0,
  },
  progressBar: {
    width: "100%",
  },
  bronzeCardMedia: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginRight: "15px",
    border: "solid 4px #b08d57",
  },
  silverCardMedia: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginRight: "15px",
    border: "solid 4px #C0C0C0",
  },
  goldCardMedia: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginRight: "15px",
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
    border: "solid 4px gold",
  },
  cardMedia: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  cardMedia2: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  bottomCardMedia: {
    width: "100%",
    height: "100px",
  },
  card: {
    display: "grid",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
    padding: 10,
  },
  expandOpenHide: {
    display: "none",
  },
  topBox: {
    width: "100%",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomBox: {
    display: "flex",
    flexWrap: "wrap",
  },

  bottomPhotoContainer: {
    maxHeight: 150,
    height: 150,
    overflow: "hidden",
    position: "relative",
    "&:empty": {
      display: "none",
    },
    "&:hover": {
      backgroundColor: "#99f",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background:
        "linear-gradient(0deg, rgb(0 0 0 / 54%), transparent, rgb(0 0 0 / 52%))",
    },
  },
  bottomPhoto: {
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    margin: 0,
    objectFit: "cover",
    objectPosition: "center",
  },
  bottomCard: {
    padding: 0,
  },
  check: {
    color: "#19db19",
    position: "absolute",
    bottom: 4,
    right: 4,
    zIndex: 1,
  },
  linkToCard: {
    color: "currentColor !important",
    textDecoration: "none",
  },
}));

export const BadgeContent = ({
  setReactedBadge,
  setBadgeMessage,
  activeJourney,
  badgeMessage,
  reactedBadge,
  setOpen,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const group = useGroup();
  const uid = localStorage.getItem("uid");
  const settings = useSettings();
  const [visitedJourneys, setVisitedJourneys] = useState([]);
  const [visitedPlacesInJourney, setVisitedPlacesInJourney] = useState([]);
  const [finalState, setFinalState] = useState([]);
  const [explorerLevel, setExplorerLevel] = useState("");
  const [explorerLevelToGet, setExplorerLevelToGet] = useState(null);
  const explorerStorage = JSON.parse(localStorage.getItem("explorer") || "[]");
  const earnedBadges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");
  const visitedPlaces = JSON.parse(
    localStorage.getItem("visitedPlaces") || "[]"
  );
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const { data, loadingData, errorData } = useQuery(BADGE_EVENTS_QUERY, {
    variables: {
      uid: uid,
    },
    fetchPolicy: "network-only",
  });

  const createJourneyList = useCallback(() => {
    data?.events?.forEach(event => {
      if (
        event.journey &&
        !visitedJourneys.find(visited => visited.id === event.journey.id)
      ) {
        setVisitedJourneys([...visitedJourneys, event.journey]);
      }
      if (
        event.place &&
        event.journey &&
        event.journey.places.find(place =>
          visitedPlaces.find(visitedPlace => place.id === visitedPlace)
        ) &&
        !visitedPlacesInJourney.find(place => place.id === event.place.id)
      ) {
        setVisitedPlacesInJourney([...visitedPlacesInJourney, event.place]);
      }
    });
  }, [visitedJourneys, visitedPlacesInJourney, visitedPlaces, data]);

  const createCardData = useCallback(() => {
    let journeyArray = [];
    let storageBadge = {
      level: 0,
      type: "",
      journey: "",
    };
    visitedJourneys.forEach(journey => {
      const journeyObjectToState = {
        name: journey.name,
        cover: journey.cover,
        id: journey.id,
        places: [],
        done: "",
        totalPlaces: journey.places.length,
        badgeLevel: "",
      };
      let visitedPlacesCount = 0;
      let totalPlacesCounnt = journey.places.length;

      let visitedPlacesArray = [];

      visitedPlacesInJourney.forEach(place => {
        if (journey.places.find(journeyPlace => journeyPlace.id === place.id)) {
          visitedPlacesArray = [...visitedPlacesArray, place];
          visitedPlacesCount++;
        }
      });
      journeyObjectToState.places = visitedPlacesArray;
      journeyObjectToState.done = parseInt(
        (visitedPlacesCount / totalPlacesCounnt) * 100
      );
      if (journeyObjectToState.done > 0) {
        journeyObjectToState.badgeLevel = "bronze";
        if (!earnedBadges?.find(badge => badge.journey === journey.id)) {
          storageBadge = {
            level: 1,
            type: "novice",
            journey: journey.id,
          };
          if (!(earnedBadges instanceof Array)) storageBadge = [storageBadge];
          earnedBadges.push(storageBadge);

          localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges));
          const userAgent = navigator.userAgent;
          if (!crawlers.includes(userAgent) && group && !settings?.debug) {
            sendEvent({
              variables: {
                input: {
                  data: {
                    type: "badge",
                    data: {
                      level: storageBadge.level,
                      type: storageBadge.type,
                    },
                    journey: journey.id,
                    group: group.id,
                    uid: uid,
                  },
                },
              },
            });
          }
        }
        if (activeJourney?.id === journeyObjectToState.id) {
          setReactedBadge([...reactedBadge, "bronze"]);
        }
      }
      if (journeyObjectToState.done >= 50) {
        journeyObjectToState.badgeLevel = "silver";
        if (!earnedBadges?.find(badge => badge.journey === journey.id)) {
          storageBadge = {
            level: 2,
            type: "advanced",
            journey: journey.id,
          };
          if (!(earnedBadges instanceof Array)) storageBadge = [storageBadge];
          earnedBadges.push(storageBadge);

          localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges));
          const userAgent = navigator.userAgent;
          if (!crawlers.includes(userAgent) && group && !settings?.debug) {
            sendEvent({
              variables: {
                input: {
                  data: {
                    type: "badge",
                    data: {
                      level: storageBadge.level,
                      type: storageBadge.type,
                    },
                    journey: journey.id,
                    group: group.id,
                    uid: uid,
                  },
                },
              },
            });
          }
        }
        if (activeJourney?.id === journeyObjectToState.id) {
          setReactedBadge([...reactedBadge, "silver"]);
        }
      }
      if (journeyObjectToState.done === 100) {
        journeyObjectToState.badgeLevel = "gold";
        if (!earnedBadges?.find(badge => badge.journey === journey.id)) {
          storageBadge = {
            level: 3,
            type: "pro",
            journey: journey.id,
          };
          if (!(earnedBadges instanceof Array)) storageBadge = [storageBadge];
          earnedBadges.push(storageBadge);

          localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges));
          const userAgent = navigator.userAgent;
          if (!crawlers.includes(userAgent) && group && !settings?.debug) {
            sendEvent({
              variables: {
                input: {
                  data: {
                    type: "badge",
                    data: {
                      level: storageBadge.level,
                      type: storageBadge.type,
                    },
                    journey: journey.id,
                    group: group.id,
                    uid: uid,
                  },
                },
              },
            });
          }
        }
        if (activeJourney?.id === journeyObjectToState.id) {
          setReactedBadge([...reactedBadge, "gold"]);
        }
      }

      journeyArray = [...journeyArray, journeyObjectToState];
    });
    setFinalState(journeyArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedJourneys, visitedPlacesInJourney, setReactedBadge]);

  const sendExplorerEvent = () => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "explorer",
              data: { level: explorerLevel },
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }
  };

  const percentOfVisitedPlaces = useCallback(() => {
    if (visitedPlaces?.length >= 1 && visitedPlaces?.length <= 24) {
      setExplorerLevelToGet(25);
      setExplorerLevel("Novice");
      if (!explorerStorage?.includes("Novice")) {
        sendExplorerEvent();

        explorerStorage.push("Novice");
        localStorage.setItem("explorer", JSON.stringify(explorerStorage));
      }
    }
    if (visitedPlaces?.length >= 25 && visitedPlaces?.length <= 59) {
      setExplorerLevelToGet(60);
      setExplorerLevel("Advanced");
      if (!explorerStorage?.includes("Advanced")) {
        sendExplorerEvent();

        explorerStorage.push("Advanced");
        localStorage.setItem("Advanced", JSON.stringify(explorerStorage));
      }
    }
    if (visitedPlaces?.length >= 60 && visitedPlaces?.length <= 149) {
      setExplorerLevelToGet(150);
      setExplorerLevel("Pro");
      if (!explorerStorage?.includes("Pro")) {
        sendExplorerEvent();

        explorerStorage.push("Pro");
        localStorage.setItem("Pro", JSON.stringify(explorerStorage));
      }
    }
    if (visitedPlaces?.length >= 150 && visitedPlaces?.length <= 1337) {
      setExplorerLevelToGet(1337);
      setExplorerLevel("Ultimate");
      if (!explorerStorage?.includes("Ultimate")) {
        sendExplorerEvent();
        explorerStorage.push("Ultimate");
        localStorage.setItem("Ultimate", JSON.stringify(explorerStorage));
      }
    }
    if (visitedPlaces?.length >= 1337) {
      setExplorerLevel("H4x0r");
      sendExplorerEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedPlaces]);

  useEffect(() => {
    if (data) createJourneyList();
  }, [createJourneyList, data]);

  useEffect(() => {
    if (visitedPlaces && !explorerLevel) percentOfVisitedPlaces();
  }, [visitedPlaces, percentOfVisitedPlaces, explorerLevel]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (finalState.length !== visitedJourneys.length) createCardData();
    }, 700);
    return () => clearInterval(timeout);
  }, [createCardData, finalState, visitedJourneys]);

  if (loadingData) return <ListSkeleton />;
  if (errorData)
    return (
      <p>
        {t("Error")}! ${errorData.message}`
      </p>
    );

  return (
    <Container component="div" className={classes.root} maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography style={{}} component="h1" variant="h5">
          {t("Badges")}
        </Typography>
        {visitedPlaces?.length ? (
          <Card style={{ marginBottom: 64 }} elevation={1}>
            <CardContent className={classes.card}>
              <Box className={classes.topBox}>
                <div>
                  <CardMedia
                    key={"place"}
                    component="img"
                    alt={"places"}
                    image={placesImage}
                    title={"places"}
                    className={classes.bronzeCardMedia}
                  />
                </div>

                <Box className={classes.box}>
                  <Typography
                    style={{ textAlign: "center", fontSize: "1.4rem" }}
                    gutterBottom
                    variant="h5"
                    component="h5"
                  >
                    {t("Level")}: {explorerLevel}
                  </Typography>

                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      color="primary"
                      value={(visitedPlaces?.length * 100) / explorerLevelToGet}
                      classes={{
                        root: classes.progressBar,
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35, marginBottom: "10px" }}>
                    <Typography variant="body2" style={{ textAlign: "center" }}>
                      {visitedPlaces?.length} / {explorerLevelToGet}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : null}
        {finalState.length && data?.events?.length ? (
          <VisitedJourneyCards
            finalState={finalState}
            visitedJourneys={visitedJourneys}
            visitedPlacesInJourney={visitedPlacesInJourney}
            setOpen={setOpen}
            uid={uid}
          />
        ) : finalState.length !== visitedJourneys.length ? (
          <ListSkeleton />
        ) : (
          <Typography
            style={{ textAlign: "center", marginTop: "30px" }}
            component="h1"
            variant="h5"
          >
            {t(
              "You don't have started journeys yet. You can collect badges by walking through journeys."
            )}
          </Typography>
        )}
      </div>
    </Container>
  );
};

const VisitedJourneyCards = ({
  visitedJourneys,
  finalState,
  visitedPlacesInJourney,
  setOpen,
}) => {
  const classes = useStyles();
  return !finalState
    ? null
    : finalState.map(journey => {
        return (
          <Paper key={journey.id} className={classes.paper} elevation={0}>
            <Card elevation={1}>
              <CardContent className={classes.card}>
                <Box className={classes.topBox}>
                  {(journey?.cover?.formats?.medium?.url ||
                    journey?.cover?.url) && (
                    <div>
                      <CardMedia
                        key={journey.cover?.formats?.medium?.url}
                        component="img"
                        alt={journey.name}
                        image={`${process.env.REACT_APP_STRAPI}${
                          journey?.cover?.formats?.medium?.url ||
                          journey?.cover?.url
                        }`}
                        title={journey.name}
                        className={
                          journey.badgeLevel === "bronze"
                            ? classes.bronzeCardMedia
                            : journey.badgeLevel === "silver"
                            ? classes.silverCardMedia
                            : journey.badgeLevel === "gold"
                            ? classes.goldCardMedia
                            : classes.cardMedia
                        }
                      />
                    </div>
                  )}
                  <Box className={classes.box}>
                    <Typography
                      style={{ textAlign: "center" }}
                      gutterBottom
                      variant="h5"
                      component="h5"
                    >
                      {journey?.name}
                    </Typography>
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        color="primary"
                        value={journey.done}
                        classes={{
                          root: classes.progressBar,
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35, marginBottom: "10px" }}>
                      <Typography
                        variant="body2"
                        style={{ textAlign: "center" }}
                      >
                        {journey?.places?.length}/{journey?.totalPlaces}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              <PlacesContent setOpen={setOpen} journey={journey} />
            </Card>
          </Paper>
        );
      });
};

const PlacesContent = ({ journey, setOpen, fromBadges = true }) => {
  const classes = useStyles();
  const votedPlaces = JSON.parse(localStorage.getItem("votedPlaces") || "[]");
  const [expanded, setExpanded] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();
  const handleExpandClick = journey => {
    setExpanded(!expanded);
  };
  const sortedPlaces = journey.places.sort((a, b) => a?.order - b?.order);
  const { data } = useQuery(RATING_QUERY, {
    fetchPolicy: "network-only",
  });

  return (
    <div>
      <CardActions
        style={{ height: "10px", padding: "0px 0px 24px 0px", marginRight: 8 }}
        disableSpacing
      >
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpenHide]: expanded,
          })}
          onClick={() => handleExpandClick(journey)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse
        style={{ minWidth: "100%", padding: 8 }}
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <Typography component="h4" variant="h5" style={{ marginBottom: 4 }}>
          {t("Visited places")}
        </Typography>
        <Box className={classes.bottomBox}>
          <BadgePlaceCards data={data} places={sortedPlaces} />

          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={() => handleExpandClick(journey)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          {/* {sortedPlaces?.map((place, i) => {
            return (
              <>
                {redirect && (
                  <Redirect
                    to={{
                      pathname: `/places/${place.id}`,
                      state: { fromBadges: fromBadges },
                    }}
                  />
                )}
                <Card
                  key={i}
                  onClick={() => {
                    setRedirect(true);
                    setOpen(false);
                  }}
                  style={{
                    width: "45%",
                    marginTop: "10px",
                    marginLeft: "10px",
                  }}
                >
                  <CardContent className={classes.bottomCard} key={place.id}>
                    <Box>
                      {place?.cover?.formats?.medium?.url ||
                      place?.cover?.url ? (
                        <div className={classes.bottomPhotoContainer}>
                          <CardMedia
                            key={place.cover?.formats?.medium?.url}
                            component="img"
                            alt={place.name}
                            image={`${process.env.REACT_APP_STRAPI}${
                              place?.cover?.formats?.medium?.url ||
                              place?.cover?.url
                            }`}
                            title={place.name}
                            className={classes.bottomPhoto}
                          />
                          <CheckCircleIcon className={classes.check} />
                        </div>
                      ) : (
                        <div className={classes.bottomPhotoContainer}>
                          <CardMedia
                            key={journey.cover?.formats?.medium?.url}
                            component="img"
                            alt={place.name}
                            image={`${process.env.REACT_APP_STRAPI}${
                              journey?.cover?.formats?.medium?.url ||
                              journey?.cover?.url
                            }`}
                            title={place.name}
                            className={classes.bottomPhoto}
                          />
                          <CheckCircleIcon className={classes.check} />
                        </div>
                      )}
                      <Typography
                        style={{ textAlign: "center", marginTop: "10px" }}
                        paragraph
                      >
                        {place.name}
                      </Typography>
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          alignContent: "space-around",
                        }}
                      >
                        {votedPlaces.map(voted => {
                          if (voted.placId === place.id)
                            return (
                              <>
                                <Typography
                                  style={{
                                    textAlign: "center",
                                    marginTop: "10px",
                                    marginBottom: 4,
                                  }}
                                  paragraph
                                >
                                  Oma arvio
                                </Typography>
                                <Rating
                                  name="simple-controlled"
                                  style={{ fontSize: "1.2rem" }}
                                  value={voted.rating}
                                  readOnly={true}
                                />
                                <AverageValue place={place} data={data} />
                              </>
                            );
                          else return null;
                        })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </>
            );
          })} */}
        </Box>
      </Collapse>
    </div>
  );
};

const AverageValue = ({ place, data }) => {
  const [ratingValue, setRatingValue] = useState([]);

  const checkIfRated = useCallback(() => {
    let ratingArray = [];

    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

    data?.events?.forEach(event => {
      if (event?.place?.id === place?.id && event?.data?.rating) {
        ratingArray.push(event?.data?.rating);
      }
      if (ratingArray.length >= 1 && event?.place?.id === place?.id) {
        const result = average(ratingArray);
        setRatingValue(Math.round(result, 1.0));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) checkIfRated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography
        style={{
          textAlign: "center",
          marginBottom: 4,
          marginTop: 12,
        }}
        paragraph
      >
        Keskiarvo
      </Typography>
      <Typography
        style={{
          textAlign: "center",
        }}
        paragraph
      >
        {ratingValue} / 5
      </Typography>
    </>
  );
};

function ListSkeleton() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <Paper className={classes.paper} elevation={0}>
              <Skeleton
                variant="rect"
                width="100%"
                height={200}
                style={{ marginTop: "30px" }}
                animation="wave"
              />
              <Skeleton
                variant="rect"
                width="100%"
                height={200}
                style={{ marginTop: "30px" }}
                animation="wave"
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
