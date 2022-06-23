import React from "react";
import { PlaceMarkers } from "./PlaceMarkers";
import { PlacesInLocation } from "./PlacesInLocation";
import "leaflet/dist/leaflet.css"; // sass
import "react-leaflet-markercluster/dist/styles.min.css"; // sass

require("leaflet/dist/leaflet.css"); // inside .js file
require("react-leaflet-markercluster/dist/styles.min.css");

export const PlacesList = ({
  data,
  currentPlace,
  unCheckedTags,
  activePlace,
  showBtn,
  setCompassPoi,
  distance,
  centerLocation,
  setPlacesWithinRadius,
  setActivePlace,
  activeJourney,
  userLocation,
  markerRef,
  semiActiveJourney,
  placesInLocation,
  setActivePlaceBounds,
  showPlaces,
  visitedPlaces,
  setVisitedPlaces,
  refetchLocation,
  setClickedPopup,
  clickedPopup,
  openJourneyContent,
  setOpenDrawer,
  setExpandPlace,
  group,
  locale,
  openDrawer,
  map,
}) => {
  return (
    <>
      {placesInLocation && (
        <PlacesInLocation
          key="places-markers-in-location"
          places={data?.placesByLocation || []}
          setActivePlace={setActivePlace}
          showBtn={showBtn}
          setCompassPoi={setCompassPoi}
          placesInLocation={placesInLocation}
          markerRef={markerRef}
          setActivePlaceBounds={setActivePlaceBounds}
          visitedPlaces={visitedPlaces}
          setVisitedPlaces={setVisitedPlaces}
          openJourneyContent={openJourneyContent}
          setOpenDrawer={setOpenDrawer}
          setClickedPopup={setClickedPopup}
          map={map}
        />
      )}
      {showPlaces && (
        <PlaceMarkers
          key="place-markers"
          places={data?.placesByLocation || []}
          currentPlace={currentPlace}
          unCheckedTags={unCheckedTags}
          activePlace={activePlace}
          setActivePlace={setActivePlace}
          showBtn={showBtn}
          setCompassPoi={setCompassPoi}
          setPlacesWithinRadius={setPlacesWithinRadius}
          activeJourney={activeJourney}
          userLocation={userLocation}
          distance={distance}
          centerLocation={centerLocation}
          markerRef={markerRef}
          semiActiveJourney={semiActiveJourney}
          placesInLocation={placesInLocation}
          setActivePlaceBounds={setActivePlaceBounds}
          visitedPlaces={visitedPlaces}
          openJourneyContent={openJourneyContent}
          setVisitedPlaces={setVisitedPlaces}
          refetchLocation={refetchLocation}
          setOpenDrawer={setOpenDrawer}
          openDrawer={openDrawer}
          group={group}
          locale={locale}
          setClickedPopup={setClickedPopup}
          clickedPopup={clickedPopup}
          setExpandPlace={setExpandPlace}
          map={map}
        />
      )}
    </>
  );
};
