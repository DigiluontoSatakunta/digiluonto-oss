import React, { memo } from "react";
import { Marker } from "react-leaflet";
import { isIOS } from "react-device-detect";

const L = require("leaflet");

const cssIcon = L.divIcon({
  className: "css-icon",

  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const cssIconIOS = L.divIcon({
  className: "css-icon-ios",

  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const UserMarker = memo(({ position }) => {
  return (
    <>
      {position && isIOS ? (
        <UserMarkerIOS position={position} />
      ) : position ? (
        <Marker icon={cssIcon} position={position} draggable={false} />
      ) : null}
    </>
  );
});

const UserMarkerIOS = memo(({ position }) => {
  return <Marker icon={cssIconIOS} position={position} draggable={false} />;
});
