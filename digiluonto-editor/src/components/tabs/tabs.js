import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AppBar from "@mui/material/AppBar";
import { useTheme } from "@mui/material/styles";

import Pois from "../pois/pois";
import Place from "../place/place";
import Stats from "../stats/stats";
import Journey from "../journey/journey";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function MyTabs({
  activePoi,
  setActivePoi,
  markerEditMode,
  setMarkerEditMode,
  tabIndex,
  setTabIndex,
  isDrawerOpen,
  setIsDrawerOpen,
  showHelp,
  setSnackBarData,
}) {
  const theme = useTheme();
  const handleChange = (_, newTabIndex) => setTabIndex(newTabIndex);

  return (
    <Box sx={{ bgcolor: "background.paper", maxWidth: "100%" }}>
      <AppBar
        position="static"
        sx={{
          boxShadow:
            "rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px;",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="Hallintapaneli, jossa on paikat, polut ja tilastot."
        >
          <Tab label="Kohteet" {...a11yProps(0)} />
          <Tab label="Tilastot" {...a11yProps(1)} />
          <Tab label="Paikka" {...a11yProps(2)} />
          <Tab label="Polku" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={tabIndex}
        onChangeIndex={handleChange}
      >
        <TabPanel value={tabIndex} index={0} dir={theme.direction}>
          <Box
            sx={{
              overflowY: "scroll",
              maxHeight: "calc(100vh - 116px)",
              pb: 2,
            }}
          >
            <Pois
              setActivePoi={setActivePoi}
              activePoi={activePoi}
              setTabIndex={setTabIndex}
            />
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={1} dir={theme.direction}>
          <Box
            sx={{
              overflowY: "scroll",
              maxHeight: "calc(100vh - 116px)",
              pb: 2,
            }}
          >
            <Stats />
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={2} dir={theme.direction}>
          <Box sx={{ overflowY: "scroll", maxHeight: "calc(100vh - 114px)" }}>
            <Place
              activePoi={activePoi}
              setActivePoi={setActivePoi}
              markerEditMode={markerEditMode}
              setMarkerEditMode={setMarkerEditMode}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setTabIndex={setTabIndex}
              showHelp={showHelp}
              setSnackBarData={setSnackBarData}
            />
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={3} dir={theme.direction}>
          <Box
            sx={{
              overflowY: "scroll",
              maxHeight: "calc(100vh - 116px)",
              pb: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Journey
              activePoi={activePoi}
              setActivePoi={setActivePoi}
              markerEditMode={markerEditMode}
              setMarkerEditMode={setMarkerEditMode}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setTabIndex={setTabIndex}
              setSnackBarData={setSnackBarData}
              showHelp={showHelp}
            />
          </Box>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
