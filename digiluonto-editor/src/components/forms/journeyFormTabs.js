import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";

import BasicInformationJourneyForm from "./journey/basicInformationJourneyForm";
import OrganizePlacesJourneyForm from "./journey/organizePlacesJourneyForm";
import ContentJourneyForm from "./journey/contentJourneyForm";
import DeleteJourneyForm from "./journey/deleteJourneyForm";

import { useMyJourneyLazily } from "../../hooks/journeys";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`journey-tabpanel-${index}`}
      aria-labelledby={`journey-tab-${index}`}
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
    id: `journey-tab-${index}`,
    "aria-controls": `journey-tabpanel-${index}`,
  };
}

export default function JourneyFormTabs({
  activePoi,
  setActivePoi,
  setMarkerEditMode,
  markerEditMode,
  isDrawerOpen,
  setIsDrawerOpen,
  setSnackBarData,
  setTabIndex,
  showHelp,
}) {
  const [formTabIndex, setFormTabIndex] = useState(0);
  const [getMyJourneyLazily, { data, loading, error }] = useMyJourneyLazily();

  const handleFormCancel = useCallback(() => {
    setActivePoi(null);
    setMarkerEditMode(false);
    setTabIndex(0);
  }, [setActivePoi, setMarkerEditMode, setTabIndex]);

  const getMyJourney = useCallback(async () => {
    try {
      await getMyJourneyLazily({
        variables: {
          id: activePoi?.id,
        },
      });
    } catch (e) {
      return <Box>Jotain ikävää tapahtui virheen muodossa: {e.message}</Box>;
    }
  }, [getMyJourneyLazily, activePoi]);

  useEffect(() => {
    if (activePoi?.__typename === "Journey") getMyJourney();
  }, [activePoi, getMyJourney]);

  useEffect(() => {
    if (data) setActivePoi(data?.journey);
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
          aria-label="Polun tietojen muokkaaminen"
        >
          <Tab label="Perustiedot" {...a11yProps(0)} />
          <Tab
            disabled={activePoi?.__typename !== "Journey"}
            label="Sisältö"
            {...a11yProps(1)}
          />
          <Tab
            disabled={activePoi?.__typename !== "Journey"}
            label="Näkyvyys"
            {...a11yProps(2)}
          />
          <Tab
            disabled={activePoi?.__typename !== "Journey"}
            label="Poista"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={formTabIndex} index={0}>
        <BasicInformationJourneyForm
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
        <ContentJourneyForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
          showHelp={showHelp}
        />
      </TabPanel>
      <TabPanel value={formTabIndex} index={2}>
        <OrganizePlacesJourneyForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          showHelp={showHelp}
          setSnackBarData={setSnackBarData}
        />
      </TabPanel>
      <TabPanel value={formTabIndex} index={3}>
        <DeleteJourneyForm
          activePoi={activePoi}
          handleFormCancel={handleFormCancel}
          setSnackBarData={setSnackBarData}
        />
      </TabPanel>
    </Box>
  );
}
