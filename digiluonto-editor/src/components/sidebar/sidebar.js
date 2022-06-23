import * as React from "react";
import MyTabs from "../tabs/tabs";

import styles from "../../../styles/Sidebar.module.css";

export default function Sidebar({
  activePoi,
  setActivePoi,
  markerEditMode,
  setMarkerEditMode,
  tabIndex,
  setTabIndex,
  showHelp,
  setSnackBarData,
}) {
  return (
    <>
      <MyTabs
        setSnackBarData={setSnackBarData}
        activePoi={activePoi}
        setActivePoi={setActivePoi}
        markerEditMode={markerEditMode}
        setMarkerEditMode={setMarkerEditMode}
        className={styles.sidebar}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        showHelp={showHelp}
      />
    </>
  );
}
