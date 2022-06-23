import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PlaceFormTabs from "../forms/placeFormTabs";
import FieldPublishSwitch from "../forms/fields/publish";

export default function Place({
  activePoi,
  setActivePoi,
  markerEditMode,
  setMarkerEditMode,
  isDrawerOpen,
  setIsDrawerOpen,
  setTabIndex,
  setSnackBarData,
  showHelp,
}) {
  useEffect(() => {
    if ("Journey" === activePoi?.__typename) setTabIndex(3);
  }, [activePoi, setTabIndex]);

  return (
    <Box sx={{ pt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 54,
          pb: 2,
          pl: 2,
          pr: 2,
        }}
      >
        <Typography variant="h5">
          {activePoi?.__typename === "Place"
            ? `Muokkaa paikkaa`
            : `Luo uusi paikka`}
        </Typography>

        {activePoi?.description && (
          <FieldPublishSwitch
            activePoi={activePoi}
            published_at={activePoi?.published_at}
            setSnackBarData={setSnackBarData}
          />
        )}
      </Box>

      <PlaceFormTabs
        activePoi={activePoi}
        setActivePoi={setActivePoi}
        setMarkerEditMode={setMarkerEditMode}
        markerEditMode={markerEditMode}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setTabIndex={setTabIndex}
        setSnackBarData={setSnackBarData}
        showHelp={showHelp}
      />
    </Box>
  );
}
