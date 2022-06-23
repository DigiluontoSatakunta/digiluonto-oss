import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import FloatingSpeedDial from "./floatingSpeedDial";
import FloatingMyLocation from "./floatingMyLocation";
import FloatingEditButton from "./floatingEditButton";

import styles from "../../../../styles/Map.module.css";

FloatingButtons.propTypes = {
  activePoi: PropTypes.object,
  setActivePoi: PropTypes.func.isRequired,
  setTabIndex: PropTypes.func.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
};

export default function FloatingButtons({
  activePoi,
  setActivePoi,
  setTabIndex,
  setIsDrawerOpen,
  markerEditMode,
}) {
  return (
    <Box className={styles.floatingButtons}>
      <FloatingSpeedDial
        setTabIndex={setTabIndex}
        setActivePoi={setActivePoi}
        setIsDrawerOpen={setIsDrawerOpen}
        markerEditMode={markerEditMode}
      />

      {activePoi && (
        <FloatingEditButton
          activePoi={activePoi}
          setTabIndex={setTabIndex}
          setIsDrawerOpen={setIsDrawerOpen}
          markerEditMode={markerEditMode}
        />
      )}

      <FloatingMyLocation />
    </Box>
  );
}
