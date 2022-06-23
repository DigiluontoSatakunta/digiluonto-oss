import {GeoJSON} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import styles from "../../../styles/Gpx.module.css";

export default function GpxRoute({data}) {
  return <GeoJSON className={styles.gpxRoute} data={data} />;
}
