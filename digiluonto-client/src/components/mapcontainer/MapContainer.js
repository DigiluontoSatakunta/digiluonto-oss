import React, { useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, useRouteMatch } from "react-router-dom";

import { MainMap } from "../map/Mainmap";

import { ContentDrawers } from "../../components/slider/ContentDrawers";
const useStyles = makeStyles(theme => ({
  map: {
    flex: "0 0 auto",
    height: 100,
    zIndex: 1,
    [theme.breakpoints.up("md")]: {
      gridArea: "map",
      position: "relative",
      minHeight: "100%",
    },
  },
}));

export const MapContainer = memo(({ setExpandPlace, expandPlace }) => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  const [activePlace, setActivePlace] = useState();
  const [activeJourney, setActiveJourney] = useState();
  const [activeJourneyBounds, setActiveJourneyBounds] = useState([]);
  const [unCheckedTags, setUnCheckedTags] = useState([]);
  const [activePlaceBounds, setActivePlaceBounds] = useState([]);
  const [zoomJourneyOnce, setZoomJourneyOnce] = useState(false);
  const [placesInLocation, setPlacesInLocation] = useState();
  const [userIsInLocation, setUserIsInLocation] = useState(null);
  const [openJourneyContent, setOpenJourneyContent] = useState([]);
  if (path === "/nearme" && activeJourney?.id)
    return <Redirect to={`/journeys/${activeJourney?.id}`} />;

  return (
    <>
      <div className={classes.map}>
        <MainMap
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
          userIsInLocation={userIsInLocation}
          setUserIsInLocation={setUserIsInLocation}
          setActiveJourneyBounds={setActiveJourneyBounds}
          setActiveJourney={setActiveJourney}
          openJourneyContent={openJourneyContent}
          setOpenJourneyContent={setOpenJourneyContent}
          setExpandPlace={setExpandPlace}
          expandPlace={expandPlace}
        />
      </div>
      <ContentDrawers
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
        userIsInLocation={userIsInLocation}
        setActiveJourneyBounds={setActiveJourneyBounds}
        setActiveJourney={setActiveJourney}
        openJourneyContent={openJourneyContent}
        setOpenJourneyContent={setOpenJourneyContent}
        setUnCheckedTags={setUnCheckedTags}
      />
    </>
  );
});
