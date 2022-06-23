import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import {
  Grid,
  Chip,
  Card,
  CardMedia,
  makeStyles,
  Typography,
  CardContent,
  Button,
} from "@material-ui/core/";

import { Content } from "./Content";
import { Speaker } from "../../../utils/Speaker";
import { ListItemPlaces } from "../nearme/NearMe";
import { useGroup } from "../../group/GroupContext";
import { useSettings } from "../../settings/SettingsContext";
import { AudioContent } from "./types/AudioContent";
import { JourneyInfoTable } from "./JourneyInfoTable";
import { SliderTitle } from "../../slider/SliderTitle";
import { JOURNEYBYID } from "../../../gql/queries/Journeys";
import { JourneyCardGroupLogo } from "../../cards/JourneyCardGroupLogo";
import { JourneyReviewCard } from "./JourneyReviewCard";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { boolean } from "boolean";
import { crawlers } from "../../../utils/crawlers";
const useStyles = makeStyles(theme => ({
  root: {
    display: "grid",
    flexGrow: 1,
    backgroundColor: "#fff",
    gridTemplateRows: "100%",
  },
  sliderGrid: {
    margin: 0,
    flex: "1 0 auto",
    maxWidth: "100%",
    display: "grid",
    marginTop: 50,
    marginBottom: 64,
  },
  mapSliderContent: {
    flex: 1,
    zIndex: 5,
    overflowY: "auto",
    background: "#fff",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  paper: {
    borderRadius: 0,
    color: theme.palette.text.secondary,
  },
  cardActions: {
    display: "flex",
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
  cardMedia: {
    marginBottom: theme.spacing(1),
  },
  cardActionsTitle: {
    flex: 1,
    marginBottom: ".2em",
  },
  cardTitleGrid: {
    position: "sticky",
    top: 0,
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  backButtonTitle: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "auto 1fr",
    gridGap: theme.spacing(2),
  },
  backButton: {
    marginRight: 0,
  },
  LinkContent: {
    display: "grid",
    padding: `${theme.spacing(2)}px 0`,
    gridTemplateColumns: "1fr",
  },
  listItem: {
    color: "#000000de",
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },
  markdown: {
    "& p:nth-of-type(1)": {
      marginRight: 60,
    },
    "& img": {
      maxWidth: "100%",
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
  journeyStartButton: {
    display: "grid",
    padding: theme.spacing(1),
    gridTemplateColumns: "1fr",
  },
  infotable: {
    marginBottom: theme.spacing(2),
  },
  startJourneyButton: {
    color: theme.palette.icon.main,
    background: "#25ac20",
    "&:hover": {
      background: "#236c20",
    },
  },
}));

export const ContentJourney = ({
  setActivePlaceBounds,
  setActiveJourneyBounds,
  setActiveJourney,
  setZoomJourneyOnce,
  activeJourney,
  setActivePlace,
  activePlace,
  openJourneyContent,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();
  const group = useGroup();
  const { settings } = useSettings();
  const [journeyActivated, setJourneyActivated] = useState(false);
  const visited = localStorage.getItem("visitedPlaces" || []);
  const uid = localStorage.getItem("uid");
  const isGpsAllowed = boolean(localStorage.getItem("isGpsAllowed"));
  const [speechUsed, setSpeechUsed] = useState(false);
  const { loading, error, data } = useQuery(JOURNEYBYID, {
    variables: {
      id,
      publicationState: settings.previewMode ? "PREVIEW" : "LIVE",
    },
    fetchPolicy: "cache-first",
  });

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const addActiveplace = () => {
    setActivePlace(journey?.places[0]);
    setActivePlaceBounds([
      [
        data?.journey?.places[0]?.geoJSON.geometry.coordinates[1],
        data?.journey?.places[0]?.geoJSON.geometry.coordinates[0],
      ],
    ]);
  };

  const handleEvent = useCallback(type => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: type,
              data: "",
              journey: data?.journey?.id,
              group: group.id,
              local: isGpsAllowed,
              uid: uid,
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (speechUsed) {
      const userAgent = navigator.userAgent;
      if (!crawlers.includes(userAgent) && group && !settings?.debug) {
        sendEvent({
          variables: {
            input: {
              data: {
                type: "textToSpeech",
                data: "",
                journey: data?.journey?.id,
                group: group.id,
                local: isGpsAllowed,
                uid: uid,
              },
            },
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechUsed]);

  useEffect(() => {
    handleEvent("contentOpened");
    return () => handleEvent("contentClosed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;

    if (activeJourney?.id !== id && !journeyActivated) {
      setJourneyActivated(true);
      setActiveJourney(data?.journey);
      if (
        data?.journey?.places.find(
          place => place.geoJSON.geometry.coordinates[1] !== null
        )
      ) {
        setActiveJourneyBounds([
          [
            data?.journey?.places[0]?.geoJSON.geometry.coordinates[1],
            data?.journey?.places[0]?.geoJSON.geometry.coordinates[0],
          ],
        ]);
      } else return;
    }
  }, [
    journeyActivated,
    activePlace,
    activeJourney,
    setActiveJourney,
    setActiveJourneyBounds,
    setActivePlaceBounds,
    id,
    data,
  ]);

  if (loading) return <ListSkeleton />;
  if (error)
    return (
      <p>
        {t("Error")}! ${error.message}`
      </p>
    );

  if (!data) return <p>{t("Not found")}</p>;

  const journey = data?.journey;
  const regex = /(\()(\/uploads\/)/gm;
  // 1. group matches "(" and 2. group matches "/uploads/"
  // This corresponds to "(/uploads/"
  // The regex is used to insert our string between the two groups
  const description = journey?.description?.replace(
    regex,
    `$1${process.env.REACT_APP_STRAPI}$2`
  );

  const sortedPlaces = Array.from(journey?.places || []).sort(
    (a, b) => a?.order - b?.order
  );

  const orderByJourney = Array.from(journey?.places || []).sort(
    (a, b) => journey?.order?.indexOf(a?.id) - journey?.order?.indexOf(b?.id)
  );

  const journeyName = (
    <>
      {journey?.name}{" "}
      {journey?.published_at === null && <Chip label={t("draft")} />}
    </>
  );

  return (
    <>
      <Helmet>
        <title>
          {journey?.name || ""} | {group?.name}
        </title>
        <meta name="description" content={journey?.excerpt || group?.welcome} />
        <body class="map-with-slider-layout" />
      </Helmet>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle
        title={journeyName}
        backButton={true}
        likeable={true}
        setActiveJourney={setActiveJourney}
        setZoomJourneyOnce={setZoomJourneyOnce}
        activeJourney={activeJourney}
        className={classes.mapSliderTitle}
        setActiveJourneyBounds={setActiveJourneyBounds}
        setActivePlaceBounds={setActivePlaceBounds}
      />
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ padding: 0, overflowY: "auto" }}>
            <Card elevation={0} square={true}>
              {(journey?.cover?.formats?.medium?.url ||
                journey?.cover?.url) && (
                <div style={{ position: "relative" }}>
                  <CardMedia
                    key={journey.cover?.formats?.medium?.url}
                    component="img"
                    alt={journey.name}
                    image={`${process.env.REACT_APP_STRAPI}${
                      journey?.cover?.formats?.medium?.url ||
                      journey?.cover?.url
                    }`}
                    title={journey.name}
                    className={classes.cardMedia}
                    style={{ marginBottom: 0 }}
                  />
                  {journey?.ownerGroup && (
                    <JourneyCardGroupLogo journey={journey} />
                  )}
                </div>
              )}

              {journey?.audioGuide?.url && (
                <AudioContent
                  link={`${process.env.REACT_APP_STRAPI}${journey?.audioGuide?.url}`}
                  loop={journey?.audioLoop}
                />
              )}

              <CardContent className={classes.markdown}>
                {typeof window?.speechSynthesis === "object" && (
                  <Speaker
                    className={classes.speaker}
                    lang={journey?.locale}
                    text={journey?.description}
                    setSpeechUsed={setSpeechUsed}
                  />
                )}
                <ReactMarkdown
                  linkTarget="_blank"
                  allowedElements={[
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "b",
                    "strong",
                    "em",
                    "italic",
                    "u",
                    "text",
                    "p",
                    "a",
                    "span",
                    "iframe",
                    "img",
                    "li",
                    "ul",
                    "ol",
                    "blockquote",
                  ]}
                >
                  {description}
                </ReactMarkdown>

                <div className={classes.infotable}>
                  <JourneyInfoTable journey={journey} />
                </div>

                <>
                  {journey?.links?.map((link, i) => (
                    <Content key={i} link={link} />
                  ))}
                  {journey?.published_at &&
                  sortedPlaces[0] &&
                  !activeJourney ? (
                    <div className={classes.journeyStartButton}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.startJourneyButton}
                        aria-label={t("Start journey")}
                        onClick={addActiveplace}
                        to="/map"
                        component={Link}
                      >
                        {t("Start journey")}
                      </Button>
                    </div>
                  ) : (
                    <div className={classes.journeyStartButton}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.startJourneyButton}
                        aria-label={t("Show journey on map")}
                        onClick={addActiveplace}
                        to="/map"
                        component={Link}
                      >
                        {t("Show journey on map")}
                      </Button>
                    </div>
                  )}
                </>
                {orderByJourney?.length !== 0 ? (
                  <div>
                    <Typography
                      gutterBottom
                      variant="h6"
                      className={classes.cardActionsTitle}
                      style={{ marginTop: 24 }}
                    >
                      {t("Destinations")}
                    </Typography>
                    <ListItemPlaces
                      openJourneyContent={openJourneyContent}
                      places={orderByJourney}
                      visited={visited}
                      journeyCover={
                        journey?.cover?.formats?.medium?.url
                          ? journey?.cover?.formats?.medium?.url
                          : journey?.cover?.url
                      }
                      setActivePlace={setActivePlace}
                      setActivePlaceBounds={setActivePlaceBounds}
                    />
                  </div>
                ) : sortedPlaces[0] ? (
                  <div>
                    <Typography
                      gutterBottom
                      variant="h6"
                      className={classes.cardActionsTitle}
                      style={{ marginTop: 24 }}
                    >
                      {t("Destinations")}
                    </Typography>
                    <ListItemPlaces
                      openJourneyContent={openJourneyContent}
                      places={sortedPlaces}
                      visited={visited}
                      journeyCover={
                        journey?.cover?.formats?.medium?.url
                          ? journey?.cover?.formats?.medium?.url
                          : journey?.cover?.url
                      }
                      setActivePlace={setActivePlace}
                      setActivePlaceBounds={setActivePlaceBounds}
                    />
                  </div>
                ) : null}
                {journey?.allowRating && (
                  <div
                    style={{
                      padding: "16px 0 0 0",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <JourneyReviewCard journey={journey} />
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

function ListSkeleton() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle title={t("Journey")} className={classes.mapSliderTitle} />
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ paddingTop: 0 }}></Grid>
        </Grid>
      </div>
    </>
  );
}
