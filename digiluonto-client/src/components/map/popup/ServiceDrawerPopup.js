import React from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

import {
  Typography,
  makeStyles,
  Button,
  Box,
  CardMedia,
  CardActions,
  Grid,
  Divider,
  SwipeableDrawer,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  drawer: {
    top: 56,
    "& .MuiDrawer-paper": {
      bottom: 56,
      border: "none",
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
    width: 400,
    top: 56,
    "& .MuiDrawer-paper": {
      bottom: 56,
      width: 400,
      border: "none",
      maxWidth: 400,
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
  },
  cardMedia: {
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    margin: 0,
    objectFit: "cover",
    objectPosition: "center",
  },
  popupDescriptionBox: {
    margin: 10,
    color: "black",
  },
  popupDescription: {
    "& p": {
      margin: "8px 0 0 !important",
      boxSizing: "border-box",
      display: "-webkit-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
      "-webkit-line-clamp": 4,
    },
  },
  activeLinkBtn: {
    minWidth: 60,
    height: 25,
    margin: 10,
    textDecoration: "none",
    color: `${theme.palette.icon.main} !important`,
    background: `${theme.palette.primary.main} !important`,
    padding: 0,
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

export const ServiceDrawerPopup = ({ open, place, setOpenDrawer }) => {
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
        {place && <DrawerContent place={place} />}
      </SwipeableDrawer>
    </>
  );
};

const DrawerContent = ({ place }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <Grid
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
        </CardActions>

        <Divider light />
      </Grid>
      <Box
        role="presentation"
        className={
          window.innerWidth < 1200
            ? classes.contentBox
            : classes.contentBoxDeskTop
        }
        style={{ bottom: 56 }}
      >
        {(place?.cover?.formats?.thumbnail?.url || place?.cover?.url) && (
          <Box className={classes.cardMediaContainer}>
            <CardMedia
              component="img"
              alt="Photo"
              image={`${process.env.REACT_APP_STRAPI}${
                place?.cover?.formats?.medium?.url || place?.cover?.url
              }`}
              title="Photo"
              className={classes.cardMedia}
            />
          </Box>
        )}
        <Box className={classes.popupDescriptionBox}>
          {place?.description && (
            <ReactMarkdown
              linkTarget="_blank"
              allowedElements={["b", "strong", "p"]}
              className={classes.popupDescription}
            >
              {place?.description}
            </ReactMarkdown>
          )}
        </Box>
      </Box>
      {place?.homepage && (
        <Button
          className={classes.activeLinkBtn}
          target="_blank"
          href={`${place?.homepage}`}
        >
          {t("Check out")}
        </Button>
      )}
    </>
  );
};
