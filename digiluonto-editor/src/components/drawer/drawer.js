import * as React from "react";
import { Global } from "@emotion/react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";

import MyTabs from "../tabs/tabs";

import styles from "../../../styles/Sidebar.module.css";

const drawerBleeding = 60;
const iOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function MyDrawer({
  activePoi,
  setActivePoi,
  markerEditMode,
  setMarkerEditMode,
  tabIndex,
  setTabIndex,
  isDrawerOpen,
  setIsDrawerOpen,
  setSnackBarData,
  showHelp,
}) {
  const toggleDrawer = newOpen => () => {
    setIsDrawerOpen(newOpen);
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: drawerBleeding,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: isDrawerOpen ? 1 : 1201,
        }}
      >
        <IconButton
          onClick={toggleDrawer(!isDrawerOpen)}
          size="small"
          component="span"
        >
          <KeyboardArrowUpIcon
            sx={{
              fontSize: 36,
              color: "#e0e0e0",
            }}
          />
        </IconButton>
      </Box>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(100vh - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor="bottom"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            background: "white",
            height: drawerBleeding,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <IconButton
            onClick={toggleDrawer(!isDrawerOpen)}
            size="small"
            component="span"
          >
            {isDrawerOpen ? (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 36,
                  color: "#e0e0e0",
                }}
              />
            ) : (
              <KeyboardArrowUpIcon
                sx={{
                  fontSize: 36,
                  color: "#e0e0e0",
                }}
              />
            )}
          </IconButton>
        </Box>

        <MyTabs
          className={styles.sidebar}
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
      </SwipeableDrawer>
    </>
  );
}
