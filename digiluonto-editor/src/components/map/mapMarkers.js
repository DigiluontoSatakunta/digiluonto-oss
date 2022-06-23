import {useEffect} from "react";
import PropTypes from "prop-types";
import {Marker, Tooltip} from "react-leaflet";

import {useLoader} from "../../hooks/loader";
import {useMyPlaces} from "../../hooks/places";
import {useMyJourneys} from "../../hooks/journeys";

import styles from "../../../styles/Marker.module.css";

MapMarkers.propTypes = {
  setActivePoi: PropTypes.func.isRequired,
};

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "",
    iconSize: [32, 32],
    shadowSize: [0, 0],
    iconAnchor: [16, 16],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
  },
});

const journeyIcon = new LeafIcon({
  iconUrl: "journeyIcon.webp",
  className: styles.journeyMarker,
});

const placeIcon = new LeafIcon({
  iconUrl: "placeIcon.svg",
  className: styles.placeMarker,
});

export default function MapMarkers({setActivePoi, activePoi}) {
  const {updateLoader} = useLoader();
  const {journeys} = useMyJourneys();
  const {places, loading} = useMyPlaces();

  useEffect(() => {
    updateLoader(loading ? true : false);
  }, [loading, updateLoader]);

  const PassiveMarker = ({poi, setActivePoi}) => {
    const handleClick = poi => setActivePoi(poi);

    if (!poi?.geoJSON?.geometry?.coordinates)
      return <>{console.log("No coordinates for POI: ", poi)}</>;

    const [lng, lat] = poi?.geoJSON?.geometry?.coordinates || [0, 0];

    return (
      <>
        {activePoi?.id !== poi?.id && (
          <Marker
            position={[lat, lng]}
            icon={poi.__typename === "Journey" ? journeyIcon : placeIcon}
            eventHandlers={{click: () => handleClick(poi)}}
          >
            <Tooltip opacity={1} offset={L.point({x: 16, y: 0})}>
              {poi?.name}
            </Tooltip>
          </Marker>
        )}
      </>
    );
  };

  const listJourneyMarkers = journeys?.map(poi => (
    <PassiveMarker key={poi.id} poi={poi} setActivePoi={setActivePoi} />
  ));

  const listPlaceMarkers = places?.map(poi => (
    <PassiveMarker key={poi.id} poi={poi} setActivePoi={setActivePoi} />
  ));

  return (
    <>
      {journeys ? listJourneyMarkers : null} {places ? listPlaceMarkers : null}
    </>
  );
}
