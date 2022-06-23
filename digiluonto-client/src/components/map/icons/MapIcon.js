import semiActiveMarker from "../../../assets/semiactivemarker.svg";
import currentIcon from "../../../assets/currentIcon.svg";
const L = require("leaflet");

export const MapIcon = (icon, className) =>
  new L.Icon({
    iconUrl: `/icons/${icon || "postal_code"}.svg`,
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [5, 13],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
    className: className,
  });

export const BlankIconSemi = className =>
  new L.Icon({
    iconUrl: semiActiveMarker,
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [5, 13],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
    className: className,
  });

export const BlankIconCurrent = className =>
  new L.Icon({
    iconUrl: currentIcon,
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [5, 13],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
    className: className,
  });
