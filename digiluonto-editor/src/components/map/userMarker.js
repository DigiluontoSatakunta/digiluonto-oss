import {useEffect} from "react";
import {Marker, useMap} from "react-leaflet";
import {useUserLocation} from "../../hooks/location";

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

const userIcon = new LeafIcon({
  iconUrl: "userIcon.webp",
  className: styles.userMarker,
});

const UserMarker = () => {
  const {userLocation, updateUserLocation} = useUserLocation();
  const map = useMap();

  useEffect(() => {
    map?.locate().on("locationfound", function (e) {
      updateUserLocation(prevLocation => {
        if (prevLocation === null) {
          // just for better DX
          if ("development" === process.env.NODE_ENV) {
            map?.setView(e.latlng, 15);
          } else {
            map?.flyTo(e.latlng, 15);
          }
        }
        return e.latlng;
      });
    });
  });

  return (
    <>
      {userLocation ? <Marker position={userLocation} icon={userIcon} /> : null}
    </>
  );
};

export default UserMarker;
