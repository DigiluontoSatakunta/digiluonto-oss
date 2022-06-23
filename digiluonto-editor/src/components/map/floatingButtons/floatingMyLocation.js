import Fab from "@mui/material/Fab";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import {useMap} from "react-leaflet";
import {useUserLocation} from "../../../hooks/location";

export default function FloatingMyLocation() {
  const {userLocation} = useUserLocation();
  const map = useMap();

  function handleClick(e) {
    e.stopPropagation();
    if (userLocation) map?.flyTo(userLocation, 15);
  }

  return (
    <Fab
      onClick={handleClick}
      color="primary"
      aria-label="keskitä kartta käyttäjän sijaintiin"
    >
      <MyLocationIcon />
    </Fab>
  );
}
