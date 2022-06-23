import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

import { makeStyles, Box, SwipeableDrawer } from "@material-ui/core/";

import loadable from "@loadable/component";

const Tags = loadable(
  () => import(/* webpackChunkName: "pages" */ "../slider/tags/Tags"),
  { resolveComponent: components => components.Tags }
);
const NearMe = loadable(
  () => import(/* webpackChunkName: "pages" */ "../slider/nearme/NearMe"),
  { resolveComponent: components => components.NearMe }
);
const ContentJourney = loadable(
  () => import(/* webpackChunkName: "contents" */ "./content/ContentJourney"),
  { resolveComponent: components => components.ContentJourney }
);
const ContentPlace = loadable(
  () => import(/* webpackChunkName: "contents" */ "./content/ContentPlace"),
  { resolveComponent: components => components.ContentPlace }
);
const PlacesInLocation = loadable(
  () =>
    import(
      /* webpackChunkName: "contents" */ "./placesinlocation/PlacesInLocation"
    ),
  { resolveComponent: components => components.PlacesInLocation }
);
const useStyles = makeStyles(theme => ({
  rootBar: {
    backgroundColor: "#212121",
    zIndex: theme.zIndex.drawer - 1,
  },
  nav: {
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowMore: {
    transform: "rotate(270deg)",
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowLess: {
    transform: "rotate(90deg)",
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  muiSelected: {
    color: theme.palette.secondary.main,
    paddingTop: "6px",
  },
  sideDrawer: {
    "& .MuiDrawer-paper": {
      top: "64px",
      width: 400,
      border: "none",
      marginBottom: 16,

      // background: "#fff0",
      zIndex: 100,
    },
    "& .MuiBackdrop-root": {
      bottom: "56px", //imp
      zIndex: 100,
    },
  },
  drawer: {
    //background: "#fff0",
    "& .MuiDrawer-paper": {
      height: "calc(100% - 64px)",
      marginBottom: 16,
      top: "56px",
      border: "none",
      // background: "#fff0",
      zIndex: 100,
    },
    "& .MuiBackdrop-root": {
      top: 56,
      bottom: "56px", //imp
      zIndex: 100,
    },
  },
  contentsBox: {},
}));

export const ContentDrawers = ({
  setActivePlace,
  activePlace,
  activeJourney,
  unCheckedTags,
  activeJourneyBounds,
  activePlaceBounds,
  setActivePlaceBounds,
  setZoomJourneyOnce,
  zoomJourneyOnce,
  setPlacesInLocation,
  placesInLocation,
  setUserIsInLocation,
  setActiveJourneyBounds,
  setActiveJourney,
  openJourneyContent,
  setOpenJourneyContent,
  setUnCheckedTags,
  userIsInLocation,
}) => {
  const classes = useStyles();

  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const toggleDrawer = (route, open) => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
    if (route === "tags") history.push("/tags");
    if (route === "nearme") history.push("/nearme");
    if (route === "map") history.push("/map");
    if (route === "/places-in-location") history.push("/places-in-location");
  };

  useEffect(() => {
    if (path === "/" || path === "/map") setOpen(false);
    if (path === "/nearme" && !open) setOpen(true);
    if (path === "/tags" && !open) setOpen(true);
    if (path === "/places-in-location" && !open) setOpen(true);
    if (path === "/places/:id" && !open) {
      setOpen(true);
    }
    if (path === "/journeys/:id" && !open) {
      setOpen(true);
    }
  }, [pathname, open, path]);

  return (
    <>
      {window.innerWidth < 1200 ? (
        <SwipeableDrawer
          transitionDuration={{ enter: 500, exit: 500 }}
          anchor={"bottom"}
          // variant="persistent"
          open={open}
          onOpen={toggleDrawer(true)}
          onClose={toggleDrawer("map", false)}
          className={classes.drawer}
          style={{ top: 56, zIndex: 1500 }}
        >
          <Box
            style={{
              overflowY: "auto",
              marginBottom: 48,
            }}
            className={classes.contentsBox}
          >
            {pathname === "/nearme" && (
              <NearMe
                setActivePlace={setActivePlace}
                activePlace={activePlace}
                activeJourney={activeJourney}
                unCheckedTags={unCheckedTags}
                activeJourneyBounds={activeJourneyBounds}
                activePlaceBounds={activePlaceBounds}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                zoomJourneyOnce={zoomJourneyOnce}
                setPlacesInLocation={setPlacesInLocation}
                placesInLocation={placesInLocation}
                setUserIsInLocation={setUserIsInLocation}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setActiveJourney={setActiveJourney}
                openJourneyContent={openJourneyContent}
                setOpenJourneyContent={setOpenJourneyContent}
                setUnCheckedTags={setUnCheckedTags}
                userIsInLocation={userIsInLocation}
              />
            )}
            {path === "/places/:id" && (
              <ContentPlace
                activeJourney={activeJourney}
                setActiveJourney={setActiveJourney}
                setActivePlace={setActivePlace}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                placesInLocation={placesInLocation}
                userIsInLocation={userIsInLocation}
                openJourneyContent={openJourneyContent}
                activePlace={activePlace}
              />
            )}
            {path === "/journeys/:id" && (
              <ContentJourney
                activeJourney={activeJourney}
                setActiveJourney={setActiveJourney}
                setActivePlace={setActivePlace}
                setActivePlaceBounds={setActivePlaceBounds}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                userIsInLocation={userIsInLocation}
                placesInLocation={placesInLocation}
                openJourneyContent={openJourneyContent}
                activePlace={activePlace}
              />
            )}
            {path === "/places-in-location" && (
              <PlacesInLocation
                placesInLocation={placesInLocation}
                unCheckedTags={unCheckedTags}
                setActivePlace={setActivePlace}
                userIsInLocation={userIsInLocation}
              />
            )}
          </Box>
          <Box
            style={{
              position: "absolute",
              overflowY: "hidden",
              height: "100%",
            }}
          >
            {pathname === "/tags" && (
              <Tags
                setActivePlace={setActivePlace}
                activePlace={activePlace}
                activeJourney={activeJourney}
                unCheckedTags={unCheckedTags}
                activeJourneyBounds={activeJourneyBounds}
                activePlaceBounds={activePlaceBounds}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                zoomJourneyOnce={zoomJourneyOnce}
                setPlacesInLocation={setPlacesInLocation}
                placesInLocation={placesInLocation}
                setUserIsInLocation={setUserIsInLocation}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setActiveJourney={setActiveJourney}
                openJourneyContent={openJourneyContent}
                setOpenJourneyContent={setOpenJourneyContent}
                setUnCheckedTags={setUnCheckedTags}
                userIsInLocation={userIsInLocation}
              />
            )}
          </Box>
        </SwipeableDrawer>
      ) : (
        <SwipeableDrawer
          transitionDuration={{ enter: 500, exit: 500 }}
          anchor={"left"}
          // variant="persistent"
          BackdropProps={{ invisible: true }}
          disableBackdropTransition={true}
          open={open}
          onOpen={toggleDrawer(true)}
          onClose={toggleDrawer("map", false)}
          className={classes.sideDrawer}
          style={{ top: 56, zIndex: 1301 }}
        >
          <Box style={{ marginBottom: 64, overflowY: "auto", height: "100%" }}>
            {pathname === "/nearme" && (
              <NearMe
                setActivePlace={setActivePlace}
                activePlace={activePlace}
                activeJourney={activeJourney}
                unCheckedTags={unCheckedTags}
                activeJourneyBounds={activeJourneyBounds}
                activePlaceBounds={activePlaceBounds}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                zoomJourneyOnce={zoomJourneyOnce}
                setPlacesInLocation={setPlacesInLocation}
                placesInLocation={placesInLocation}
                setUserIsInLocation={setUserIsInLocation}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setActiveJourney={setActiveJourney}
                openJourneyContent={openJourneyContent}
                setOpenJourneyContent={setOpenJourneyContent}
                setUnCheckedTags={setUnCheckedTags}
                userIsInLocation={userIsInLocation}
              />
            )}

            {path === "/places/:id" && (
              <ContentPlace
                activeJourney={activeJourney}
                setActiveJourney={setActiveJourney}
                setActivePlace={setActivePlace}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                placesInLocation={placesInLocation}
                userIsInLocation={userIsInLocation}
                openJourneyContent={openJourneyContent}
                activePlace={activePlace}
              />
            )}
            {path === "/journeys/:id" && (
              <ContentJourney
                activeJourney={activeJourney}
                setActiveJourney={setActiveJourney}
                setActivePlace={setActivePlace}
                setActivePlaceBounds={setActivePlaceBounds}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                userIsInLocation={userIsInLocation}
                placesInLocation={placesInLocation}
                openJourneyContent={openJourneyContent}
                activePlace={activePlace}
              />
            )}
          </Box>
          <Box
            style={{
              position: "absolute",
              overflowY: "hidden",
              height: "100%",
            }}
          >
            {pathname === "/tags" && (
              <Tags
                setActivePlace={setActivePlace}
                activePlace={activePlace}
                activeJourney={activeJourney}
                unCheckedTags={unCheckedTags}
                activeJourneyBounds={activeJourneyBounds}
                activePlaceBounds={activePlaceBounds}
                setActivePlaceBounds={setActivePlaceBounds}
                setZoomJourneyOnce={setZoomJourneyOnce}
                zoomJourneyOnce={zoomJourneyOnce}
                setPlacesInLocation={setPlacesInLocation}
                placesInLocation={placesInLocation}
                setUserIsInLocation={setUserIsInLocation}
                setActiveJourneyBounds={setActiveJourneyBounds}
                setActiveJourney={setActiveJourney}
                openJourneyContent={openJourneyContent}
                setOpenJourneyContent={setOpenJourneyContent}
                setUnCheckedTags={setUnCheckedTags}
                userIsInLocation={userIsInLocation}
              />
            )}
          </Box>
        </SwipeableDrawer>
      )}
    </>
  );
};
