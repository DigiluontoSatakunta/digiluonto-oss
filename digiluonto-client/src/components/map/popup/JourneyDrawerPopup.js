import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab/";
import {
  Typography,
  makeStyles,
  Paper,
  Box,
  CardMedia,
  CardActions,
  Grid,
  Divider,
  SwipeableDrawer,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
import { JOURNEYBYID } from "../../../gql/queries/Journeys";

import "../mapcss/Mainmap.css";
import { useMutation } from "@apollo/client";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useGroup } from "../../group/GroupContext";
import { useSettings } from "../../settings/SettingsContext";
import { crawlers } from "../../../utils/crawlers";
const useStyles = makeStyles(theme => ({
  drawer: {
    //background: "#fff0",
    top: 56,
    "& .MuiDrawer-paper": {
      bottom: 56,

      border: "none",
      //background: "#fff0",
    },
    "& .MuiDrawer-root": {
      top: 56,
    },
    "& .MuiBackdrop-root": {
      bottom: "56px", //imp
      top: "65vh",
    },
  },
  desktopDrawer: {
    //background: "#fff0",
    width: 400,
    top: 56,
    "& .MuiDrawer-paper": {
      bottom: 56,
      width: 400,
      border: "none",
      maxHeight: 500,
      // height: 400,
      maxWidth: 400,
      //background: "#fff0",
    },
    "& .MuiDrawer-root": {
      top: 56,
      width: 400,
    },
    "& .MuiBackdrop-root": {
      bottom: "56px", //imp
      top: "65vh",
      width: 400,
    },
  },
  contentBox: {
    display: "flex",
    background: "#fff",
    maxHeight: "25vh",
  },
  contentBoxDeskTop: {
    display: "flex",
    background: "#fff",
    maxWidth: 400,
    overflowX: "hidden",
    flexDirection: "column",
    // position: "absolute",
    minHeight: 150,
    maxHeight: 500,
    top: 36,
  },
  cardMediaContainer: {
    minWidth: "40vw",
    maxWidth: "40vw",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    justifyContent: "center",
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
  cardMedia: {
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    margin: 0,
    objectFit: "cover",
    objectPosition: "center",
  },
  popupTitle: {
    margin: 0,

    background: "#363636ab",
    boxShadow: "none",

    display: "flex",
    color: "#fff",
    borderRadius: "0 30px 0 0",
  },
  popupDescriptionBox: {
    margin: 12,
    color: "black",
    overflow: "hidden",
    padding: 0,
  },
  popupDescription: {
    "& p": {
      margin: "8px 0 0 !important",
      boxSizing: "border-box",
      display: "-webkit-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": 4,
    },
  },
  popupText: {
    boxSizing: "border-box",
    wordBreak: "break-word",
  },
  popupContent: {
    minWidth: 30,
  },
  activeLinkBtn: {
    float: "left",
    minWidth: 60,
    height: 25,
    marginBottom: 5,
    textDecoration: "none",
    color: `${theme.palette.primary.main} !important`,
    padding: "0",
  },
  activeLinkBtn2: {
    float: "right",
    minWidth: 60,
    height: 25,
    marginBottom: 5,
    textDecoration: "none",
    padding: 0,
    color: `${theme.palette.primary.main} !important`,
  },
  linkToCard: {
    color: "currentColor !important",
    textDecoration: "none",
  },
  lock: {
    position: "relative",
    fontSize: "1.2em",
    marginRight: 4,
    color: "#737373",
  },
  key: {
    position: "relative",
    fontSize: "1.2em !important",
    marginRight: 4,
    color: "#737373",
  },
  buttonDiv: {
    display: "grid",
    padding: theme.spacing(1),
    gridTemplateColumns: " 1fr",
  },
  startButton: {
    textDecoration: "none",
    background: "#399839 !important",
    color: "#fff",
  },
  endButton: {
    textDecoration: "none",
    background: "#f44237",
    color: "#fff",
  },
  cardActions: {
    display: "flex",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: 4,
    paddingBottom: 0,
  },
  cardActionsTitle: {
    flexGrow: 1,
    paddingLeft: theme.spacing(0.5),
    marginBottom: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));

export const JourneyDrawerPopup = ({
  open,
  setOpenDrawer,
  journey,
  activeJourney,
  semiActiveJourney,
  setExpandPlace,
  setOpenJourneyContent,
  setActiveJourney,
  setSemiActiveJourney,
}) => {
  const classes = useStyles();

  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };
  return (
    <>
      <SwipeableDrawer
        // ModalProps={{ hideBackdrop: true }}
        BackdropProps={{ invisible: true }}
        disableBackdropTransition={true}
        //variant="persistent"
        transitionDuration={{ enter: 400, exit: 400 }}
        anchor={"bottom"}
        open={open}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
        className={
          window.innerWidth < 1200 ? classes.drawer : classes.desktopDrawer
        }
        style={{ top: "65vh" }}
      >
        {journey?.id && (
          <DrawerReady
            journey={journey}
            setExpandPlace={setExpandPlace}
            semiActiveJourney={semiActiveJourney}
            activeJourney={activeJourney}
            setActiveJourney={setActiveJourney}
            setSemiActiveJourney={setSemiActiveJourney}
            setOpenJourneyContent={setOpenJourneyContent}
          />
        )}
      </SwipeableDrawer>
    </>
  );
};

const DrawerReady = ({
  journey,
  activeJourney,
  semiActiveJourney,
  setExpandPlace,
  setOpenJourneyContent,
  setActiveJourney,
  setSemiActiveJourney,
}) => {
  return (
    <>
      <DrawerContent
        journey={journey}
        setExpandPlace={setExpandPlace}
        semiActiveJourney={semiActiveJourney}
        activeJourney={activeJourney}
        setActiveJourney={setActiveJourney}
        setSemiActiveJourney={setSemiActiveJourney}
        setOpenJourneyContent={setOpenJourneyContent}
      />
    </>
  );
};

const DrawerContent = ({
  journey,
  setExpandPlace,
  activeJourney,
  semiActiveJourney,
  setActiveJourney,
  setSemiActiveJourney,
  setOpenJourneyContent,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const uid = localStorage.getItem("uid");
  const settings = useSettings();
  const group = useGroup();
  const {
    data: journeyPlaceData,
    loadingData,
    errorData,
  } = useQuery(JOURNEYBYID, {
    variables: {
      id: journey.id,
    },
  });

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const deActivate = () => {
    setSemiActiveJourney(null);
    setActiveJourney(null);
    setOpenJourneyContent(null);
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "journeyEnded",
              data: "",
              journey: journeyPlaceData?.journey?.id,
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }
  };

  const activate = () => {
    setActiveJourney(journey);
    setSemiActiveJourney(null);
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "journeyStarted",
              data: "",
              journey: journeyPlaceData?.journey?.id,
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }
  };
  useEffect(() => {
    setExpandPlace(journey);
  }, [journey, setExpandPlace, activeJourney, semiActiveJourney]);

  if (loadingData) return <ListSkeleton />;
  if (errorData)
    return (
      <p>
        {t("Error")}! ${errorData.message}`
      </p>
    );

  let startPoint, touch;
  const touchStart = event => {
    startPoint = event.nativeEvent.touches[0].clientY;
  };
  const toggleDrawer = event => {
    touch = event?.nativeEvent?.touches[0]?.clientY;
    if (startPoint > touch) history.push(`/journeys/${journey.id}`);
  };

  return (
    <>
      <Grid
        onTouchStart={e => touchStart(e)}
        onTouchMove={e => toggleDrawer(e)}
        onClick={() => history.push(`/journeys/${journey.id}`)}
        item
        xs={12}
        className={classes.cardTitleGrid}
        data-element="slider-title"
        style={{ paddingBottom: 0, zIndex: 5, marginTop: 0 }}
      >
        <CardActions disableSpacing className={classes.cardActions}>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            className={classes.cardActionsTitle}
          >
            {journey.name}
          </Typography>
        </CardActions>

        <Divider light />
      </Grid>
      <Box
        onTouchStart={e => touchStart(e)}
        onTouchMove={e => toggleDrawer(e)}
        onClick={() => history.push(`/journeys/${journey.id}`)}
        role="presentation"
        className={
          window.innerWidth < 1200
            ? classes.contentBox
            : classes.contentBoxDeskTop
        }
        style={{ bottom: 56 }}
      >
        {(journeyPlaceData?.journey?.cover?.formats?.thumbnail?.url ||
          journeyPlaceData?.journey?.cover?.url) && (
          <Box className={classes.cardMediaContainer}>
            <CardMedia
              component="img"
              alt="Photo"
              image={`${process.env.REACT_APP_STRAPI}${
                journeyPlaceData.journey?.cover?.formats?.medium?.url ||
                journeyPlaceData.journey?.cover?.url
              }`}
              title="Photo"
              className={classes.cardMedia}
            />
          </Box>
        )}

        <Box className={classes.popupDescriptionBox}>
          {journeyPlaceData?.journey?.description && (
            <Box className={classes.popupText}>
              <ReactMarkdown
                linkTarget="_blank"
                allowedElements={["b", "strong", "p"]}
                className={classes.popupDescription}
                style={{ maxHeight: "100px" }}
              >
                {journeyPlaceData?.journey?.description}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </Box>
      {activeJourney ? (
        <div className={classes.buttonDiv}>
          <Button
            variant="contained"
            color="primary"
            className={classes.endButton}
            place={journeyPlaceData?.journey}
            onClick={() => deActivate()}
          >
            {t("End journey")}
          </Button>
        </div>
      ) : (
        <div className={classes.buttonDiv}>
          <Button
            variant="contained"
            color="primary"
            className={classes.startButton}
            place={journeyPlaceData?.journey}
            onClick={() => activate()}
          >
            {t("Start journey")}
          </Button>
        </div>
      )}
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
