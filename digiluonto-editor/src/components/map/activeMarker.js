import {useEffect} from "react";
import {Marker, useMap, useMapEvents, Circle} from "react-leaflet";

import GpxRoute from "../gpx/gpxRoute";

import styles from "../../../styles/Marker.module.css";

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

const activeJourneyIcon = new LeafIcon({
  iconUrl: "journeyIcon.webp",
  className: styles.activeJourneyMarker,
});

const activePlaceIcon = new LeafIcon({
  iconUrl: "placeIcon.svg",
  className: styles.activePlaceMarker,
});

export default function ActiveMarker({
  activePoi,
  setActivePoi,
  setTabIndex,
  markerEditMode,
  setMarkerEditMode,
}) {
  const map = useMap();

  const mapEvents = useMapEvents({
    click(e) {
      if (!activePoi?.id && markerEditMode) {
        setActivePoi({
          name: "",
          __typename: "Marker",
          geoJSON: {
            properties: {
              radius: 10,
            },
            geometry: {
              coordinates: [e.latlng.lng, e.latlng.lat],
            },
          },
        });
      }

      if (activePoi?.id && markerEditMode) {
        setActivePoi(poi => ({
          ...poi,
          geoJSON: {
            ...poi?.geoJSON,
            geometry: {
              ...poi?.geoJSON?.geometry,
              coordinates: [e.latlng.lng, e.latlng.lat],
            },
          },
        }));
      }
    },
  });

  useEffect(() => {
    if (activePoi) {
      const [lng, lat] = activePoi?.geoJSON?.geometry?.coordinates;
      map?.flyTo([lat, lng]);
    }
  }, [activePoi, map]);

  const ActiveMarker = ({poi}) => {
    const handleClick = () => {
      setMarkerEditMode(false);
      setActivePoi(null);
      setTabIndex(0);
    };

    const [lng, lat] = poi?.geoJSON?.geometry?.coordinates;

    return (
      <>
        <Marker
          position={[lat, lng]}
          icon={
            poi.__typename === "Journey" ? activeJourneyIcon : activePlaceIcon
          }
          eventHandlers={{click: () => handleClick()}}
        />
        {poi?.route ? (
          <GpxRoute data={poi?.route} />
        ) : (
          <Circle
            center={[
              poi?.geoJSON?.geometry.coordinates[1],
              poi?.geoJSON?.geometry.coordinates[0],
            ]}
            fillColor="#4caf4f"
            pathOptions={{color: "#4caf4f"}}
            radius={poi?.geoJSON?.properties?.radius || 10}
          />
        )}
      </>
    );
  };

  return activePoi ? <ActiveMarker poi={activePoi} /> : null;
}
