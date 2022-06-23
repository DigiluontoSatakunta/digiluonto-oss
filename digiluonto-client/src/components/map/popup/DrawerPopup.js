import React, { useEffect } from "react";
import { Redirect, useHistory, Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import { useTranslation } from "react-i18next";

import { PLACEBYID } from "../../../gql/queries/Places";

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
  IconButton,
} from "@material-ui/core";
import { ExpandLess } from "@material-ui/icons/";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useQuery } from "@apollo/client";

import { useGroup } from "../../group/GroupContext";

import { ListItemPlaces } from "../../slider/nearme/NearMe";
import { boolean } from "boolean";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
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
      // minHeight: 250,
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
    minHeight: "15vh",
  },
  contentBoxDeskTop: {
    display: "flex",
    background: "#fff",
    maxWidth: 400,
    overflowX: "hidden",
    flexDirection: "column",
    // position: "absolute",
    minHeight: 150,
    maxHeight: 300,
    top: 36,
  },
  cardMediaContainer: {
    maxWidth: "45vw",
    minWidth: "45vw",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    // "&:empty": {
    //   display: "none",
    // },
    // "&:hover": {
    //   backgroundColor: "#99f",
    // },
    // "&::after": {
    //   content: '""',
    //   position: "absolute",
    //   left: 0,
    //   right: 0,
    //   top: 0,
    //   bottom: 0,
    //   background:
    //     "linear-gradient(0deg, rgb(0 0 0 / 54%), transparent, rgb(0 0 0 / 52%))",
    // },
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
    maxWidth: "45vw",
    background: "#363636ab",
    boxShadow: "none",

    display: "flex",
    color: "#fff",
    borderRadius: "0 30px 0 0",
  },
  popupDescriptionBox: {
    margin: 12,
    color: "black",
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
    padding: 10,
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
  startOrEndButton: {
    minWidth: 60,
    height: 25,
    textDecoration: "none",
    color: theme.palette.primary.main,
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

export const DrawerPopup = ({
  open,
  place,
  visitedPlaces,
  openJourneyContent,
  setOpenDrawer,
  setExpandPlace,
  placesInLocation,
  unCheckedTags,
  setActivePlace,
  userIsInLocation,
  activeJourney,
}) => {
  const classes = useStyles();
  const group = useGroup();
  const uid = localStorage.getItem("uid");
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
        BackdropProps={{ invisible: true }}
        disableBackdropTransition={true}
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
        {!placesInLocation && place?.id ? (
          <DrawerContent
            place={place}
            visitedPlaces={visitedPlaces}
            openJourneyContent={openJourneyContent}
            setExpandPlace={setExpandPlace}
            userIsInLocation={userIsInLocation}
            uid={uid}
            group={group}
            activeJourney={activeJourney}
          />
        ) : (
          <PlacesContent
            placesInLocation={placesInLocation}
            unCheckedTags={unCheckedTags}
            setActivePlace={setActivePlace}
            userIsInLocation={userIsInLocation}
          />
        )}
      </SwipeableDrawer>
    </>
  );
};

const PlacesContent = ({
  placesInLocation,
  unCheckedTags,
  setActivePlace,
  userIsInLocation,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  let startPoint, touch;
  const touchStart = event => {
    startPoint = event.nativeEvent.touches[0].clientY;
  };
  const toggleDrawer = event => {
    touch = event?.nativeEvent?.touches[0]?.clientY;
    if (startPoint > touch) history.push(`/places-in-location`);
  };
  const filteredPlaces = placesInLocation?.filter(place =>
    place?.tags?.map(tag => tag.id).some(t => !unCheckedTags?.includes(t))
  );
  return (
    <div>
      <Grid
        onTouchStart={e => touchStart(e)}
        onTouchMove={e => toggleDrawer(e)}
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
            {t("Kohteet sijainnissa")}
          </Typography>
        </CardActions>
        <Divider light />
      </Grid>
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
    </div>
  );
};

const DrawerContent = ({
  place,
  setExpandPlace,
  openJourneyContent,
  userIsInLocation,
  visitedPlaces,
  activeJourney,
  group,
  uid,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const isGpsAllowed = boolean(localStorage.getItem("isGpsAllowed"));
  const { t } = useTranslation();
  const settings = useSettings();
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const { data, loadingData, errorData } = useQuery(PLACEBYID, {
    variables: {
      id: place.id,
    },
  });

  useEffect(() => {
    setExpandPlace(place);
  }, [place, setExpandPlace]);

  let startPoint, touch;
  const touchStart = event => {
    startPoint = event.nativeEvent.touches[0].clientY;
  };
  const toggleDrawer = event => {
    touch = event?.nativeEvent?.touches[0]?.clientY;
    if (startPoint > touch) {
      const userAgent = navigator.userAgent;
      if (!crawlers.includes(userAgent) && group && !settings?.debug) {
        sendEvent({
          variables: {
            input: {
              data: {
                type: "contentOpened",
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
      history.push(`/places/${place.id}`);
    }
  };
  if (loadingData) return <ListSkeleton />;
  if (errorData)
    return (
      <p>
        {t("Error")}! ${errorData.message}`
      </p>
    );

  return (
    <>
      <Grid
        onTouchStart={e => touchStart(e)}
        onTouchMove={e => toggleDrawer(e)}
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
            {place.name}
          </Typography>
          <IconButton
            component={Link}
            to={`/places/${place.id}`}
            aria-label="close"
            className={classes.expand}
          >
            <ExpandLess />
          </IconButton>
          {data?.place?.token ? (
            <VpnKeyIcon className={classes.key} />
          ) : !data?.place?.publicContent &&
            !openJourneyContent?.places?.find(
              place => place.id === data?.place.id
            ) &&
            !userIsInLocation &&
            !visitedPlaces?.includes(data?.place?.id) ? (
            <LockIcon className={classes.lock} />
          ) : null}
        </CardActions>

        <Divider light />
      </Grid>
      <Box
        onTouchStart={e => touchStart(e)}
        onTouchMove={e => toggleDrawer(e)}
        onClick={e => {
          history.push(`/places/${place.id}`);
          const userAgent = navigator.userAgent;
          if (!crawlers.includes(userAgent) && group && !settings?.debug) {
            sendEvent({
              variables: {
                input: {
                  data: {
                    type: "contentOpened",
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
        }}
        role="presentation"
        className={
          window.innerWidth < 1200
            ? classes.contentBox
            : classes.contentBoxDeskTop
        }
        style={{ bottom: 56 }}
      >
        {(data?.place?.cover?.formats?.thumbnail?.url ||
          data?.place?.cover?.url) && (
          <Box className={classes.cardMediaContainer}>
            <CardMedia
              component="img"
              alt="Photo"
              image={`${process.env.REACT_APP_STRAPI}${
                data.place?.cover?.formats?.medium?.url ||
                data.place?.cover?.url
              }`}
              title="Photo"
              className={classes.cardMedia}
            />
          </Box>
        )}
        <Box className={classes.popupDescriptionBox}>
          {data?.place?.description && (
            <ReactMarkdown
              linkTarget="_blank"
              allowedElements={["b", "strong", "p"]}
              className={classes.popupDescription}
            >
              {data?.place?.description}
            </ReactMarkdown>
          )}
        </Box>
      </Box>
    </>
  );
};

function ListSkeleton() {
  const classes = useStyles();

  return (
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
  );
}
