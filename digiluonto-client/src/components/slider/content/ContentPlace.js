import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@material-ui/lab/";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import TagManager from "react-gtm-module";
import { Helmet } from "react-helmet";
import loadable from "@loadable/component";

import { useGroup } from "../../group/GroupContext";
import { useSettings } from "../../settings/SettingsContext";

import { Speaker } from "../../../utils/Speaker";
import { NextPlaceInJourney } from "./NextPlaceInJourney";
import { NearMeJourneyCards } from "../../cards/NearMeJourneyCards";
import Modal from "@material-ui/core/Modal";

import LockIcon from "@material-ui/icons/Lock";
import {
  makeStyles,
  Grid,
  Chip,
  Paper,
  Card,
  Divider,
  Typography,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
} from "@material-ui/core/";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { SliderTitle } from "../SliderTitle";
import { Content } from "./Content";
import { AudioContent } from "./types/AudioContent";

import { PLACEBYID } from "../../../gql/queries/Places";
import { LightBox } from "./lightbox/LightBox";

import { SENDEVENT } from "../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { boolean } from "boolean";
import { crawlers } from "../../../utils/crawlers";
const ReviewCard = loadable(
  () => import(/* webpackChunkName: "imageGallery" */ "./ReviewCard"),
  { resolveComponent: components => components.ReviewCard }
);
const QuestionCard = loadable(
  () => import(/* webpackChunkName: "imageGallery" */ "./QuestionCard"),
  { resolveComponent: components => components.QuestionCard }
);
const ImageGallery = loadable(
  () => import(/* webpackChunkName: "imageGallery" */ "./types/ImageGallery"),
  { resolveComponent: components => components.ImageGallery }
);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    display: "grid",
    gridTemplateRows: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  sliderGrid: {
    margin: 0,
    flex: "1 0 auto",
    maxWidth: "100%",
    display: "grid",
    marginTop: 50,
  },
  mapSliderContent: {
    flex: 1,
    zIndex: 5,
    overflowY: "auto",
    background: "#fff",
  },
  paper: {
    borderRadius: 0,
    color: theme.palette.text.secondary,
  },
  cardMedia: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    height: "280",
    minWidth: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  backButton: {
    marginRight: 0,
  },
  coverPhoto: {
    marginTop: 0,
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
  markdownContent: {
    "& img": {
      maxWidth: "100%",
    },
  },
  seeOnMap: {
    display: "grid",
    padding: theme.spacing(1),
    gridTemplateColumns: "1fr",
  },
  seeOnMapButton: {
    color: theme.palette.icon.main,
  },
  Ar: {
    margin: 0,
    overflow: "none",
    height: "90vh",
    width: "100%",
    zIndex: "2000",
  },
  closedContent: {
    width: "100%",
    marginTop: 16,
  },
  openContentTextField: {
    width: "60% !important",
    padding: 0,
    margin: 0,
    left: "20%",
    tansform: "translateX(-20%)",
  },
  key: {
    fontSize: "4em !important",
  },
  keyContainer: {
    width: "100%",
    textAlign: "center",
  },
}));

export const ContentPlace = ({
  activeJourney,
  setActiveJourney,
  setActivePlace,
  setZoomJourneyOnce,
  userIsInLocation,
  openJourneyContent,
  placesInLocation,
  activePlace,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();
  const { settings } = useSettings();
  const group = useGroup();
  const isGpsAllowed = boolean(localStorage.getItem("isGpsAllowed"));
  const uid = localStorage.getItem("uid");
  const [closedContentKey, setClosedContentKey] = useState("");

  const { loading, error, data } = useQuery(PLACEBYID, {
    variables: {
      id,
      publicationState: settings.previewMode ? "PREVIEW" : "LIVE",
    },
    fetchPolicy: "cache-first",
  });

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const handleEvent = useCallback(type => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: type,
              data: "",
              place: data?.place?.id,
              journey: activeJourney ? activeJourney.id : null,
              group: group?.id,
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
    return () => handleEvent("contentClosed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <ListSkeleton />;
  if (error)
    return (
      <p>
        {t("Error")}! ${error.message}`
      </p>
    );
  if (!data) return <p>{t("Not found")}</p>;

  if (data.place?.tags.length)
    TagManager.dataLayer({
      event: "PlaceTag",
      tag: {
        name: data.place.tags[0].name,
      },
    });

  const visitedPlaces = JSON.parse(
    localStorage.getItem("visitedPlaces") || "[]"
  );

  const usedTokens = JSON.parse(localStorage.getItem("usedTokens") || "[]");

  if (
    openJourneyContent?.places?.find(place => place?.id === data?.place.id) &&
    !visitedPlaces.includes(data?.place?.id)
  ) {
    try {
      visitedPlaces.push(data?.place?.id);
      localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
    } catch {
      localStorage.setItem("visitedPlaces", "[]");
    }
  }

  if (
    userIsInLocation?.id === data?.place?.id &&
    !visitedPlaces.includes(userIsInLocation?.id)
  ) {
    try {
      visitedPlaces.push(userIsInLocation.id);
      localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
    } catch {
      localStorage.setItem("visitedPlaces", "[]");
    }
  }

  if (
    closedContentKey === data?.place?.token &&
    !usedTokens.includes(data?.place?.token) &&
    !visitedPlaces.includes(data?.place?.id)
  ) {
    visitedPlaces.push(data?.place?.id);
    localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
    usedTokens.push(data?.place?.token);
    localStorage.setItem("usedTokens", JSON.stringify(usedTokens));
  }

  if (
    closedContentKey !== data?.place?.token &&
    closedContentKey.length === data?.place?.token?.length
  )
    handleEvent("tokenUseFailed");

  const placeName = (
    <>
      {data.place?.name}{" "}
      {data.place?.published_at === null && <Chip label={t("draft")} />}
    </>
  );

  return (
    <>
      <Helmet>
        <title>
          {data?.place?.name} | {group.name}
        </title>
        <meta
          name="description"
          content={data.place?.description || group?.welcome}
        />
        <body class="map-with-slider-layout" />
      </Helmet>
      {/* <Link to="/map" className={classes.placeholder}></Link> */}
      <SliderTitle
        title={placeName}
        className={classes.mapSliderTitle}
        likeable={true}
        backButton={true}
        activeJourney={activeJourney}
        setActiveJourney={setActiveJourney}
        setZoomJourneyOnce={setZoomJourneyOnce}
      />
      <div className={classes.mapSliderContent}>
        <Grid container spacing={3} className={classes.sliderGrid}>
          <Grid item xs={12} style={{ overflowY: "auto", padding: 0 }}>
            <Paper
              className={classes.paper}
              elevation={0}
              style={{ borderRadius: 0 }}
            >
              {usedTokens?.find(token => token === data?.place?.token) ||
              (closedContentKey === data?.place?.token && !data?.place?.qr) ||
              (data?.place?.token === null && !data?.place?.qr) ? (
                <OpenContent
                  data={data}
                  activeJourney={activeJourney}
                  setActivePlace={setActivePlace}
                  userIsInLocation={userIsInLocation}
                  usedTokens={usedTokens}
                  group={group}
                  uid={uid}
                  visitedPlaces={visitedPlaces}
                  placesInLocation={placesInLocation}
                  openJourneyContent={openJourneyContent}
                  isGpsAllowed={isGpsAllowed}
                />
              ) : (
                <ClosedContent
                  closedContentKey={closedContentKey}
                  setClosedContentKey={setClosedContentKey}
                  place={data?.place}
                  qr={data?.place?.qr}
                  image={
                    data?.place?.cover?.formats?.medium?.url
                      ? data?.place?.cover?.formats?.medium?.url
                      : data?.place?.cover?.url
                  }
                  token={data?.place?.token}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const OpenContent = ({
  data,
  activeJourney,
  setActivePlace,
  userIsInLocation,
  visitedPlaces,
  openJourneyContent,
  placesInLocation,
  group,
  isGpsAllowed,
  uid,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const settings = useSettings();
  const [isAnswered, setIsAnswered] = useState(false);
  const [speechUsed, setSpeechUsed] = useState(false);
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const [openLightBox, setOpenLightBox] = useState(false);
  const [includesImageUrl, setIncludesImagerUrl] = useState("");

  const handleClose = () => {
    setOpenLightBox(false);
  };
  const handleLightBoxOpen = imageUrl => {
    setIncludesImagerUrl(imageUrl);
    setOpenLightBox(true);
  };

  const handleMediaEvent = type => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "mediaOpened",
              data: `type: ${type}`,
              place: data?.place?.id,
              group: group?.id,
              uid: uid,
            },
          },
        },
      });
    }
  };
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
  const regex = /(\()(\/uploads\/)/gm;
  // 1. group matches "(" and 2. group matches "/uploads/"
  // This corresponds to "(/uploads/"
  // The regex is used to insert our string between the two groups
  const content = data.place?.content
    ? data.place?.content.replace(regex, `$1${process.env.REACT_APP_STRAPI}$2`)
    : "";
  return (
    <>
      {!data?.place?.publicContent &&
      !visitedPlaces.includes(data?.place?.id) &&
      !openJourneyContent?.places?.find(place => place.id === data.place.id) &&
      !placesInLocation?.find(place => place.id === data.place.id) ? (
        <LockedContent place={data?.place} />
      ) : (
        <Card elevation={0}>
          <CardActionArea />
          {(data.place?.cover?.formats?.medium?.url ||
            data.place?.cover?.url) && (
            <CardMedia
              component="img"
              alt="Photo"
              image={`${process.env.REACT_APP_STRAPI}${
                data.place?.cover?.formats?.medium?.url ||
                data.place?.cover?.url
              }`}
              title="Photo"
              className={classes.cardMedia}
              onClick={() => {
                handleLightBoxOpen(
                  `${process.env.REACT_APP_STRAPI}${data.place?.cover?.url}`
                );
                handleMediaEvent("lightBox");
              }}
            />
          )}

          {data.place?.audioGuide?.url && (
            <AudioContent
              link={`${process.env.REACT_APP_STRAPI}${data.place?.audioGuide?.url}`}
            />
          )}

          {!userIsInLocation && (
            <div className={classes.seeOnMap}>
              <Button
                variant="contained"
                color="primary"
                aria-label="Katso kartalta"
                onClick={() => {
                  setActivePlace(data?.place);
                }}
                to="/map"
                component={Link}
                className={classes.seeOnMapButton}
              >
                {t("Show on map")}
              </Button>
            </div>
          )}
          {data?.place?.ar.length ? (
            <div className={classes.seeOnMap}>
              <Button
                variant="contained"
                color="primary"
                to={`/arcamera/${data?.place?.id}`}
                component={Link}
                className={classes.seeOnMapButton}
                onClick={() => handleMediaEvent("ar")}
              >
                {t("Avaa AR")}
              </Button>
            </div>
          ) : null}
          {content?.length && (
            <CardContent className={classes.markdownContent}>
              {typeof window?.speechSynthesis === "object" && (
                <Speaker
                  className={classes.speaker}
                  lang={data.place.language}
                  text={content}
                  setSpeechUsed={setSpeechUsed}
                />
              )}
              <MarkdownContent
                handleMediaEvent={handleMediaEvent}
                content={content}
                handleLightBoxOpen={handleLightBoxOpen}
              />
            </CardContent>
          )}
          <>
            {data?.place?.gallery.length ? (
              <ImageGallery images={data?.place?.gallery} />
            ) : null}
          </>
          <>
            {data.place?.links?.map((link, i) => (
              <Content
                key={i}
                link={link}
                place={data?.place}
                group={group}
                uid={uid}
              />
            ))}
          </>
          {data?.place?.questions?.length && activeJourney ? (
            <div
              style={{
                padding: 16,
                backgroundColor: "#fafafa",
              }}
            >
              <QuestionCard
                isAnswered={isAnswered}
                setIsAnswered={setIsAnswered}
                activeJourney={activeJourney}
                place={data?.place}
              />
            </div>
          ) : null}
          {data?.place.allowRating && (
            <div
              style={{
                padding: 16,
                backgroundColor: "#fafafa",
              }}
            >
              <ReviewCard place={data?.place} />
            </div>
          )}
          {!!activeJourney &&
            !!activeJourney.places.find(
              journeyPlace => journeyPlace.id === data.place.id
            ) && // makes sure that the selected place belongs/is part of the active journey
            activeJourney.showNextPlace === true && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: "#fafafa",
                }}
              >
                <NextPlaceInJourney
                  placeId={data.place.id}
                  activeJourney={activeJourney}
                  setActivePlace={setActivePlace}
                />
              </div>
            )}

          {!activeJourney && data?.place?.journeys?.length ? (
            <div style={{ padding: 16, paddingBottom: 56 }}>
              <Divider style={{ marginTop: 16 }} />
              <Typography
                variant="h5"
                style={{ marginBottom: 16, marginTop: 16 }}
              >
                {t("Place is part of journeys")}
              </Typography>
              <NearMeJourneyCards journeys={data?.place?.journeys} />
            </div>
          ) : null}
        </Card>
      )}
      <Modal
        open={openLightBox}
        onClose={handleClose}
        aria-labelledby="see-on-lightbox"
        aria-describedby="see-on-lightbox"
        style={{ zIndex: 1502 }}
      >
        <LightBox includesImageUrl={includesImageUrl} />
      </Modal>
    </>
  );
};

const LockedContent = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card style={{ boxShadow: "none" }}>
      <div className={classes.closedContent}>
        <div className={classes.keyContainer}>
          <LockIcon className={classes.key} />
        </div>
        <h2 style={{ maxWidth: "100%", textAlign: "center", margin: "1em" }}>
          {t("You have to visit in the place to see content")}
        </h2>
      </div>
    </Card>
  );
};

const ClosedContent = ({ setClosedContentKey, place, qr }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = event => {
    setClosedContentKey(event.target.value.toUpperCase());
  };

  return (
    <>
      {qr ? (
        <Card style={{ boxShadow: "none" }}>
          <div className={classes.closedContent}>
            <div className={classes.keyContainer}>
              <QrCodeScannerIcon className={classes.key} />
            </div>
            <h2
              style={{ maxWidth: "100%", textAlign: "center", margin: "1em" }}
            >
              {t("Open the content by QR code scanner")}
            </h2>
            <div className={classes.seeOnMap}>
              <Button
                variant="contained"
                color="primary"
                to={`/qrcamera/${place?.id}/${place?.token}`}
                component={Link}
                className={classes.seeOnMapButton}
              >
                {t("QR scanner")}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card style={{ boxShadow: "none" }}>
          <div className={classes.closedContent}>
            <div className={classes.keyContainer}>
              <VpnKeyIcon className={classes.key} />
            </div>
            <h2
              style={{ maxWidth: "100%", textAlign: "center", margin: "1em" }}
            >
              {t("Enter the key you found in the place to open the content")}
            </h2>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                className={classes.openContentTextField}
                id="key-label"
                label="Key"
                variant="outlined"
                onChange={handleChange}
              />
            </Box>
          </div>
        </Card>
      )}
    </>
  );
};

const MarkdownContent = ({ content, handleLightBoxOpen, handleMediaEvent }) => {
  return (
    <ReactMarkdown
      skipHtml={false}
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
      rehypePlugins={[rehypeRaw]}
      linkTarget="_blank"
      components={{
        p: ({ node, children }) => {
          if (node.children[0].tagName === "img") {
            return (
              <div>
                <img
                  src={`${node?.children[0]?.properties?.src}`}
                  alt={node?.children[0]?.properties?.alt}
                  onClick={() =>
                    handleLightBoxOpen(node?.children[0]?.properties?.src)
                  }
                />
              </div>
            );
          }
          return (
            <p
              onClick={e => {
                if (e.target === "a") handleMediaEvent("link");
              }}
            >
              {children}
            </p>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

function ListSkeleton() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle title={t("Place")} className={classes.mapSliderTitle} />
      <div className={classes.mapSliderContent} style={{ height: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <Paper className={classes.paper} elevation={0}>
              <Skeleton
                variant="rect"
                width="100%"
                height={320}
                animation="wave"
              />
              <div style={{ padding: "16px" }}>
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="90%" animation="wave" />
                <Skeleton variant="text" width="80%" animation="wave" />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
