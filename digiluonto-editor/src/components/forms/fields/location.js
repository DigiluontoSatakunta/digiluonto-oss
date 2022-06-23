import {useEffect} from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapIcon from "@mui/icons-material/Map";

import {useUserLocation} from "../../../hooks/location";

export default function FieldLocationPicker({
  setValue,
  setMarkerEditMode,
  markerEditMode,
  activeMarker,
  setActiveMarker,
  setActivePoi,
  activePoi,
  title,
  description,
  isDrawerOpen,
  setIsDrawerOpen,
  showHelp,
}) {
  const {userLocation} = useUserLocation();

  const handleSetMarkerEditMode = () => {
    // in mobile view, close the drawer
    if (!markerEditMode && isDrawerOpen) setIsDrawerOpen(false);
    // set marker edit mode
    setMarkerEditMode(prev => !prev);
  };

  const handleSetUserLocation = () => {
    if (userLocation) {
      setMarkerEditMode(false);
      setActiveMarker(userLocation);

      setValue("latitude", userLocation.lat);
      setValue("longitude", userLocation.lng, {shouldDirty: true});

      if (activePoi?.geoJSON?.geometry?.coordinates) {
        setActivePoi(prev => ({
          ...prev,
          geoJSON: {
            ...prev.geoJSON,
            geometry: {
              ...prev.geoJSON.geometry,
              coordinates: [userLocation.lng, userLocation.lat],
            },
          },
        }));
      } else {
        // set a new one if not exists yet
        setActivePoi({
          name: "",
          __typename: "Marker",
          geoJSON: {
            properties: {
              radius: 10,
            },
            geometry: {
              coordinates: [userLocation.lng, userLocation.lat],
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    if (activeMarker) {
      setValue("latitude", activeMarker.lat);
      setValue("longitude", activeMarker.lng, {shouldDirty: true});
    }
  }, [activeMarker, setValue]);

  return (
    <>
      <Typography variant="h6" sx={{mt: 2, mb: 1}}>
        {title}
      </Typography>

      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          {description}
        </Typography>
      )}

      <FormControl
        fullWidth={true}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 1,
          mb: 2,
          mt: 2,
          h: 6,
        }}
      >
        <Box
          sx={{
            gap: 1,
            display: "flex",
            flex: "1 0 auto",
            minHeight: "100%",
            alignItems: "center",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            borderBottom: "1px solid #8b8b8b",
            backgroundColor: "rgba(0, 0, 0, 0.06)",
          }}
        >
          <LocationOnIcon
            sx={{
              height: "48px",
              width: "48px",
              padding: "8px",
              color: "#757575",
              marginTop: "1px",
              background: "#d9d9d982",
              borderTopLeftRadius: "4px",
              borderBottom: "1px solid #8b8b8b",
            }}
          />
          <Typography
            variant="span"
            sx={{
              textAlign: "center",
              flex: 1,
              userSelect: "none",
              ml: -2,
            }}
          >
            {activeMarker && (
              <>
                {activeMarker?.lat?.toFixed(5)}, {activeMarker?.lng?.toFixed(5)}
              </>
            )}
          </Typography>
        </Box>
        <Button
          variant={markerEditMode ? "outlined" : "contained"}
          onClick={handleSetMarkerEditMode}
        >
          <MapIcon />
        </Button>
        <Button variant="contained">
          <MyLocationIcon onClick={handleSetUserLocation} />
        </Button>
      </FormControl>
    </>
  );
}
