import "leaflet/dist/leaflet.css";
import "../mapcss/Mainmap.css";

const L = require("leaflet");

export const PointerIcon = new L.divIcon({
  iconUrl: "/blue.png",
  shadowUrl: "/marker-shadow.png",
  html: '<div class="bouncing"></div>',
  iconSize: [25, 25],
  iconAnchor: [5, 13],
  popupAnchor: [7, 13],
  shadowSize: [41, 41],
  className: "PointerIcon",
});
