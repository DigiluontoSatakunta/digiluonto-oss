import React from "react";
import { Marker } from "react-leaflet";

export const JourneyMarker = ({
  journey,
  icon,
  setClickedPopup,
  clickedPopup,
  activeJourney,
  semiActiveJourney,
  setActiveJourney,
  setSemiActiveJourney,
  setActivePlace,
  setOpenJourneyContent,
  markerRef,
  setOpenJourneyDrawer,
  openJourneyDrawer,
  map,
}) => {
  const handleClickEvents = () => {
    if (openJourneyDrawer) {
      setOpenJourneyDrawer(false);
    }
    setClickedPopup(journey);
    setActivePlace(null);
    if (!activeJourney && !semiActiveJourney) {
      setSemiActiveJourney(journey);
    }
    if (semiActiveJourney) setSemiActiveJourney(null);

    if (!openJourneyDrawer && !semiActiveJourney) setOpenJourneyDrawer(true);
  };

  return (
    <Marker
      key={journey.id}
      position={[...journey.geoJSON.geometry.coordinates].reverse()}
      radius={journey.geoJSON.properties.radius || 20}
      icon={icon}
      ref={markerRef}
      eventHandlers={{
        click: () => {
          handleClickEvents();
        },
      }}
    ></Marker>
  );
};
