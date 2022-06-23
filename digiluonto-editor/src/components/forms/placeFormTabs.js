import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";

import BasicInformationPlaceForm from "./place/basicInformationPlaceForm";
import VisibilityPlaceForm from "./place/visibilityPlaceForm";
import ContentPlaceForm from "./place/contentPlaceForm";
import DeletePlaceForm from "./place/deletePlaceForm";

import { useMyPlaceLazily } from "../../hooks/places";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`place-tabpanel-${index}`}
      aria-labelledby={`place-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
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
    id: `place-tab-${index}`,
    "aria-controls": `place-tabpanel-${index}`,
  };
}

export default function PlaceFormTabs({
  activePoi,
  setActivePoi,
  setMarkerEditMode,
  markerEditMode,
  isDrawerOpen,
  setIsDrawerOpen,
  setTabIndex,
  setSnackBarData,
  showHelp,
}) {
  const [formTabIndex, setFormTabIndex] = useState(0);
  const [getMyPlaceLazily, { data, loading, error }] = useMyPlaceLazily();

  const handleFormCancel = useCallback(() => {
    setActivePoi(null);
    setMarkerEditMode(false);
    setTabIndex(0);
  }, [setActivePoi, setMarkerEditMode, setTabIndex]);

  const getMyPlace = useCallback(async () => {
    try {
      await getMyPlaceLazily({
        variables: {
          id: activePoi?.id,
        },
      });
    } catch (e) {
      return <Box>Jotain ikävää tapahtui virheen muodossa: {e.message}</Box>;
    }
  }, [getMyPlaceLazily, activePoi]);

  useEffect(() => {
    if (activePoi?.__typename === "Place") getMyPlace();
  }, [activePoi, getMyPlace]);

  useEffect(() => {
    if (data) setActivePoi(data?.place);
  }, [data, setActivePoi]);

  const handleChange = (_, newValue) => {
    setFormTabIndex(newValue);
  };

  if (loading) return <Box sx={{ px: 2 }}>Ladataan...</Box>;

  if (error)
    return (
      <Alert severity="error">
        Jotain ikävää tapahtui latauksessa virheen muodossa: {error.message}
      </Alert>
    );

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={formTabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Paikan tietojen muokkaaminen"
        >
          <Tab label="Perustiedot" {...a11yProps(0)} />
          <Tab disabled={!activePoi} label="Sisältö" {...a11yProps(1)} />
          <Tab disabled={!activePoi} label="Näkyvyys" {...a11yProps(2)} />
          <Tab disabled={!activePoi} label="Poista" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={formTabIndex} index={0}>
        <BasicInformationPlaceForm
          activePoi={activePoi}
          setActivePoi={setActivePoi}
          setMarkerEditMode={setMarkerEditMode}
          markerEditMode={markerEditMode}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setTabIndex={setTabIndex}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
          showHelp={showHelp}
        />
      </TabPanel>
      <TabPanel value={formTabIndex} index={1}>
        <ContentPlaceForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
          showHelp={showHelp}
        />
      </TabPanel>
      <TabPanel value={formTabIndex} index={2}>
        <VisibilityPlaceForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
          showHelp={showHelp}
        />
      </TabPanel>
      <TabPanel value={formTabIndex} index={3}>
        <DeletePlaceForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
        />
      </TabPanel>
    </Box>
  );
}
