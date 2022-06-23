import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ExpandMore, ArrowBack } from "@material-ui/icons/";
import MapIcon from "@mui/icons-material/Map";
import {
  Grid,
  Divider,
  IconButton,
  Typography,
  CardActions,
  makeStyles,
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  cardActions: {
    display: "flex",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: 4,
    paddingBottom: 0,
  },
  cardActionsTitle: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    marginBottom: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  cardTitleGrid: {
    flex: "0 0 auto",
    zIndex: 5,
    maxWidth: "100%",
    height: "fit-content",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    padding: "0 !important",
    position: "fixed",
    width: window.innerWidth < 1200 ? "100%" : 400,
    [theme.breakpoints.up("md")]: {
      gridArea: "title",
    },
  },
}));

export const SliderTitle = ({
  title,
  backButton,
  likeable,
  activeJourney,
  setActiveJourney,
  setZoomJourneyOnce,
  extraStyle = {},
}) => {
  const classes = useStyles();
  const location = useLocation();
  const fromHome = location?.state?.fromHome;
  const fromPlacesInLocation = location?.state?.fromPlacesInLocation;
  const fromBadges = location?.state?.fromBadges;
  const isPlace = location.pathname.includes("/places/");

  return (
    <Grid
      item
      xs={12}
      className={classes.cardTitleGrid}
      data-element="slider-title"
      style={{ paddingBottom: 0, zIndex: 5, marginTop: 0 }}
    >
      <CardActions disableSpacing className={classes.cardActions}>
        {backButton && (
          <IconButton
            edge="end"
            aria-label="navigation"
            onClick={() => {
              if (!isPlace && setActiveJourney) {
                setActiveJourney(null);
                setZoomJourneyOnce(false);
              }
            }}
            component={Link}
            to={
              fromHome
                ? `/`
                : fromPlacesInLocation
                ? "/places-in-location"
                : isPlace && activeJourney
                ? `/journeys/${activeJourney.id}`
                : fromBadges
                ? `/map`
                : `/nearme`
            }
            className={classes.backButton}
          >
            <ArrowBack />
          </IconButton>
        )}
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          className={classes.cardActionsTitle}
        >
          {title}
        </Typography>
        {/*
        {likeable && (
          <IconButton
            aria-label="like"
            onClick={() =>
              alert("You can mark Place as your favorite (in future).")
            }
          >
            <StarOutline />
          </IconButton>
        )}
        */}
        <IconButton
          component={Link}
          to="/map"
          aria-label="close"
          className={classes.expand}
        >
          {window.innerWidth < 1200 ? <ExpandMore /> : <MapIcon />}
        </IconButton>
      </CardActions>
      <Divider light />
    </Grid>
  );
};
