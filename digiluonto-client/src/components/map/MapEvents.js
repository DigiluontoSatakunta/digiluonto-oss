import { useSettings } from "../settings/SettingsContext";
import { useMapEvents } from "react-leaflet";
import "./mapcss/Mainmap.css";
import { useState } from "react";
import { useLocation } from "../location/LocationContext";

export const MapEvents = ({
  setFavouriteLocation,
  setUserLocation,
  setCenterLocation,
  setZoomLevel,
  children,
  setFollowUser,
  followUser,
  geoJsonInfo,
  setGeoJsonInfo,
  setLocationAccuracy,
  setClickedPopup,
  setLocaitonError,
  clickedPopup,
  setOpenDrawer,
  setOpenJourneyDrawer,
  openDrawer,
  setExpandPlace,
}) => {
  const { settings } = useSettings();
  const [zoomCounter, setZoomCounter] = useState(0);
  const { updateLocation } = useLocation();
  // eslint-disable-next-line
  const map = useMapEvents({
    click: e => {
      setZoomCounter(0);
      setOpenDrawer(false);
      setOpenJourneyDrawer(false);
      if (geoJsonInfo.position.length) {
        setGeoJsonInfo({
          position: [],
          highestAlt: null,
          lowestAlt: null,
          averageAlt: null,
        });
      }
      if (settings.favMode) setFavouriteLocation(e.latlng);
      if (settings.debug) {
        updateLocation([e.latlng.lat, e.latlng.lng]);
        setUserLocation([e.latlng.lat, e.latlng.lng]);
      }
      setFollowUser(false);
    },
    moveend: e => {
      setCenterLocation([map.getCenter().lat, map.getCenter().lng]);
    },
    dragstart: e => {
      setFollowUser(false);
    },
    zoomstart: e => {
      if (followUser || clickedPopup) setZoomCounter(zoomCounter + 1);
    },
    locationfound: e => {
      if (!settings.debug) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
        setLocationAccuracy(e.accuracy);
      }
    },
    locationerror: e => {
      setLocaitonError(e.type);
    },
    zoomend: () => {
      if (zoomCounter >= 5) {
        setZoomCounter(0);
      }
      if (zoomCounter >= 4) {
        setZoomCounter(0);
        setFollowUser(false);
      }
      setZoomLevel(map.getZoom());
      const counter = document.getElementsByClassName("counter")[0];
      if (counter) counter.cssText = "counter-reset: order-counter 0";
    },
    move: () => {},
  });

  return <>{children}</>;
};
