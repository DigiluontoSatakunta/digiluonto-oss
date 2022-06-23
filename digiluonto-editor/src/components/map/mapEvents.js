import {useMapEvents} from "react-leaflet";
import {useUserLocation} from "../../hooks/location";

const MapEvents = ({children}) => {
  const {updateUserLocation} = useUserLocation();

  const map = useMapEvents({
    locationfound: e => {
      updateUserLocation(e.latlng);
    },
    locationerror: e => {
      console.log("Paikannus epäonnistui", e.type);
    },
    contextmenu: e => {
      console.log("Valikko on poistettu käytöstä");
    },
  });

  return <>{children}</>;
};

export default MapEvents;
