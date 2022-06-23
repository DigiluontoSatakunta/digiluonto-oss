import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import JourneyFormTabs from "../forms/journeyFormTabs";
import FieldPublishSwitch from "../forms/fields/publish";

export default function Journey({
  activePoi,
  setActivePoi,
  markerEditMode,
  setMarkerEditMode,
  isDrawerOpen,
  setIsDrawerOpen,
  setSnackBarData,
  setTabIndex,
  showHelp,
}) {
  useEffect(() => {
    if ("Place" === activePoi?.__typename) setTabIndex(2);
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
          {activePoi?.__typename === "Journey"
            ? `Muokkaa polkua`
            : `Luo uusi polku`}
        </Typography>

        {activePoi?.excerpt && (
          <FieldPublishSwitch
            activePoi={activePoi}
            published_at={activePoi?.published_at}
            setSnackBarData={setSnackBarData}
          />
        )}
      </Box>

      <JourneyFormTabs
        activePoi={activePoi}
        setActivePoi={setActivePoi}
        setMarkerEditMode={setMarkerEditMode}
        markerEditMode={markerEditMode}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setSnackBarData={setSnackBarData}
        setTabIndex={setTabIndex}
        showHelp={showHelp}
      />
    </Box>
  );
}
