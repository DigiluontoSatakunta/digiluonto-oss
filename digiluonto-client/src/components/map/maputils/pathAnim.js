import "leaflet/dist/leaflet.css";

const L = require("leaflet");
let pLineGroup = L.layerGroup();

export default function pathAnim(activeJourney, data, mapInstance) {
  pLineGroup.clearLayers();

  let pathArray = [];
  for (let i = 0; i < data?.placesByLocation.length; i++) {
    let place = data?.placesByLocation[i];
    const journeysIds = place?.journeys?.map(journey => journey.id);

    if (journeysIds.includes(activeJourney)) {
      pathArray.push([...place.geoJSON.geometry.coordinates].reverse());
    }
  }

  /* @TODO Ei käytetä mapInsntacea vaan map contextia const map = useMap() */
  pLineGroup.addLayer(L.polyline(pathArray));
  pLineGroup.addTo(mapInstance).snakeIn();
}
