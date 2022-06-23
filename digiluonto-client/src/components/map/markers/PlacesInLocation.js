import React, { memo } from "react";
import { CustomMarker } from "./CustomMarker";
import { MapIcon } from "../icons/MapIcon";

export const PlacesInLocation = memo(
  ({
    setActivePlace,
    showBtn,
    setCompassPoi,
    placesInLocation,
    markerRef,
    setActivePlaceBounds,
    setClickedPopup,
    setOpenDrawer,
    clickedPopup,
  }) => {
    return placesInLocation?.map((place, i) => {
      return (
        <CustomMarker
          key={i}
          place={place}
          icon={MapIcon(place?.icon, "currentIcon")}
          setActivePlace={setActivePlace}
          showBtn={showBtn}
          setCompassPoi={setCompassPoi}
          markerRef={markerRef}
          setActivePlaceBounds={setActivePlaceBounds}
          setClickedPopup={setClickedPopup}
          setOpenDrawer={setOpenDrawer}
          clickedPopup={clickedPopup}
        />
      );
    });
  }
);
