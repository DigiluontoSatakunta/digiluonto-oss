import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

import { SnackbarProvider, useSnackbar } from "notistack";
import { MapContainer, TileLayer, LayerGroup } from "react-leaflet";
import "leaflet-defaulticon-compatibility";

import { UserLocation } from "../hooks/location";
import { useUser } from "../hooks/user";

import MapEvents from "./map/mapEvents";
import MapMarkers from "./map/mapMarkers";
import UserMarker from "./map/userMarker";

import FloatingButtons from "./map/floatingButtons/floatingButtons";
import Button from "@mui/material/Button";
// import these only when needed
const Sidebar = dynamic(() => import("./sidebar/sidebar"));
const MyDrawer = dynamic(() => import("./drawer/drawer"));
const ActiveMarker = dynamic(() => import("./map/activeMarker"));

import styles from "../../styles/Map.module.css";

export default function Map({ showHelp }) {
  const { user } = useUser();

  const [snackBarData, setSnackBarData] = useState({
    type: "",
    message: "",
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [activePoi, setActivePoi] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [markerEditMode, setMarkerEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setInnerWidth]);

  const handleSnackBar = useCallback(
    (variant, message) => {
      enqueueSnackbar(snackBarData.message, { variant });
      setSnackBarData({ type: "", message: "" });
    },
    [snackBarData, enqueueSnackbar]
  );

  useEffect(() => {
    if (snackBarData.type === "success") {
      handleSnackBar(snackBarData.type);
    }
    if (snackBarData.type === "error") {
      handleSnackBar(snackBarData.type);
    }
  }, [snackBarData, handleSnackBar]);

  return (
    <UserLocation>
      <MapContainer
        center={[61.5, 26]}
        zoom={7}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        attributionControl={true}
        zoomControl={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayerGroup>
          <MapMarkers
            activePoi={activePoi}
            setActivePoi={setActivePoi}
            setTabIndex={setTabIndex}
          />
        </LayerGroup>

        {user && (
          <MapEvents>
            <LayerGroup>
              <UserMarker />
            </LayerGroup>
          </MapEvents>
        )}

        <LayerGroup>
          <ActiveMarker
            activePoi={activePoi}
            setActivePoi={setActivePoi}
            setTabIndex={setTabIndex}
            markerEditMode={markerEditMode}
            setMarkerEditMode={setMarkerEditMode}
          />
        </LayerGroup>

        <FloatingButtons
          setTabIndex={setTabIndex}
          setIsDrawerOpen={setIsDrawerOpen}
          setActivePoi={setActivePoi}
          activePoi={activePoi}
          markerEditMode={markerEditMode}
        />
      </MapContainer>
      {/* <SnackBar snackBarData={snackBarData} /> */}
      {innerWidth < 900 ? (
        <MyDrawer
          activePoi={activePoi}
          setActivePoi={setActivePoi}
          markerEditMode={markerEditMode}
          setMarkerEditMode={setMarkerEditMode}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          showHelp={showHelp}
          setSnackBarData={setSnackBarData}
        />
      ) : (
        <Sidebar
          activePoi={activePoi}
          setActivePoi={setActivePoi}
          markerEditMode={markerEditMode}
          setMarkerEditMode={setMarkerEditMode}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          showHelp={showHelp}
          setSnackBarData={setSnackBarData}
        />
      )}
    </UserLocation>
  );
}
