import React, { useEffect, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";

import "../mapcss/Mainmap.css";

export const CustomMarker = ({
  place,
  setActivePlace,
  showBtn,
  setCompassPoi,
  icon,
  markerRef,
  setActivePlaceBounds,
  tooltip,
  visitedPlaces,
  checked,
  map,
  setOpenPopup,
  openPopup,
  clickedPopup,
  setClickedPopup,
  openJourneyContent,
  semiActiveJourney,
  activeJourney,
  setOpenDrawer,
  setExpandPlace,
  currentPlace,
}) => {
  const [visitedId, setVisitedId] = useState();
  const counterIcon = document.getElementsByClassName("counter")[0];
  useEffect(() => {
    if (visitedPlaces?.includes(place?.id)) {
      setVisitedId(place?.id);
    }
    if (map) {
      map.eachLayer(function (layer) {
        if (
          layer.options.className === "counter" &&
          layer._latlng.lat === place.geoJSON.geometry.coordinates[1] &&
          visitedId === place.id
        )
          layer?.setOpacity(0);
      });
    }
  }, [
    markerRef,
    setActivePlace,
    checked,
    visitedId,
    visitedPlaces,
    clickedPopup,
    place,
    map,
  ]);

  if (semiActiveJourney || activeJourney) {
    if (currentPlace) counterIcon?.style?.setProperty("background", "#14e220");
  }

  const handleClick = e => {
    setOpenDrawer(true);
    setClickedPopup(place);
    setActivePlace(null);
    setActivePlaceBounds([]);
  };

  return (
    <Marker
      className="counter-parent"
      key={place.id}
      position={[...place.geoJSON.geometry.coordinates].reverse()}
      radius={20}
      icon={icon}
      ref={markerRef}
      eventHandlers={{
        click: e => {
          handleClick();
        },
      }}
    >
      {tooltip && (
        <Tooltip
          className="counter"
          direction="center"
          offset={[8, 3]}
          opacity={visitedId ? 0 : 1}
          permanent
        ></Tooltip>
      )}
    </Marker>
  );
};
