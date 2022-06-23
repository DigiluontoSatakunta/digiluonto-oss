import goldPng from "../../../assets/gold-2x.png";
import favouriteShadow from "../../../assets/marker-shadow.png";

const L = require("leaflet");

export const FavouriteIcon = new L.Icon({
  iconUrl: goldPng,
  shadowUrl: favouriteShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  shadowSize: [41, 41],
});
