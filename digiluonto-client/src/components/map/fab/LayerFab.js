import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import LayersIcon from "@material-ui/icons/Layers";
import {
  Fab,
  Slide,
  Checkbox,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "leaflet/dist/leaflet.css";
import { Layer1, Layer2, Layer3, Layer4 } from "../maputils/Layers";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { crawlers } from "../../../utils/crawlers";
import { useSettings } from "../../settings/SettingsContext";

const useStyles = makeStyles(theme => ({
  checkBoxes: {
    display: "block",
    width: "100%",
    float: "left",
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  checkBoxContainer: {
    width: "88%",
    display: "block",
    height: "100%",
  },
  checkBoxesRight: {
    float: "right",
    padding: "0",
    position: "relative",
    top: "0",
  },
  fab: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  paper: {
    width: "275px",
    height: "auto",
    background: "white",
    zIndex: 1000,
    position: "absolute",
    margin: theme.spacing(1),
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  radioButtons: {
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
  },
  checkButtons: {
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
  },
  toolbar: {
    //minHeight: "56px !important",
    gridTemplateColumns: "auto 96px",
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.icon.main,
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const LayerFab = ({
  showDataSources,
  setShowDataSources,
  setLoadedFirePlaceStates,
  setShowPlaces,
  setShowJourneys,
  setShowRoutes,
  showPlaces,
  showJourneys,
  showRoutes,
  centerLocation,
  zoomLevel,
  group,
  map,
}) => {
  const classes = useStyles();

  const [value] = useState(localStorage.getItem("mapLayer") || "default");
  const [checked, setChecked] = useState(false);
  const handleClickAway = () => {
    setChecked(false);
  };
  const checkAllLayers = useCallback(() => {
    map.eachLayer(function (layer) {
      if (layer._url) map.removeLayer(layer);
    });
  }, [map]);
  useEffect(() => {
    if (map) map.addLayer(Layer1);
    if (value === "default" && map) {
      checkAllLayers();
      map.addLayer(Layer1);
      localStorage.setItem("mapLayer", "default");
    } else if (value === "satellite" && map) {
      checkAllLayers();
      map.addLayer(Layer2);
      localStorage.setItem("mapLayer", "satellite");
    } else if (value === "highvariation" && map) {
      checkAllLayers();
      map.addLayer(Layer3);
      localStorage.setItem("mapLayer", "highvariation");
    } else if (value === "cycleroutes" && map) {
      checkAllLayers();
      map.addLayer(Layer4);
      localStorage.setItem("mapLayer", "cycleroutes");
    }
  }, [map, value, checkAllLayers]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Fab
          color="primary"
          aria-label="center"
          size="small"
          className={classes.fab}
          onClick={() => setChecked(true)}
        >
          <LayersIcon />
        </Fab>
        <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
          <Paper className={classes.paper}>
            <LayerTabs
              map={map}
              showDataSources={showDataSources}
              setShowDataSources={setShowDataSources}
              setLoadedFirePlaceStates={setLoadedFirePlaceStates}
              group={group}
              setShowPlaces={setShowPlaces}
              setShowJourneys={setShowJourneys}
              setShowRoutes={setShowRoutes}
              showPlaces={showPlaces}
              showJourneys={showJourneys}
              showRoutes={showRoutes}
              centerLocation={centerLocation}
              zoomLevel={zoomLevel}
            />
          </Paper>
        </Slide>
      </div>
    </ClickAwayListener>
  );
};

const LayerTabs = ({
  showDataSources,
  setShowDataSources,
  setShowPlaces,
  setShowJourneys,
  setShowRoutes,
  showPlaces,
  showJourneys,
  showRoutes,
  centerLocation,
  setLoadedFirePlaceStates,
  zoomLevel,
  group,
  map,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.toolbar}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label={t("Places")} {...a11yProps(0)} />
          <Tab label={t("Map")} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PlacesContent
          map={map}
          showDataSources={showDataSources}
          setShowDataSources={setShowDataSources}
          group={group}
          setShowPlaces={setShowPlaces}
          setShowJourneys={setShowJourneys}
          setShowRoutes={setShowRoutes}
          showPlaces={showPlaces}
          showJourneys={showJourneys}
          showRoutes={showRoutes}
          centerLocation={centerLocation}
          setLoadedFirePlaceStates={setLoadedFirePlaceStates}
          zoomLevel={zoomLevel}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LayersContent map={map} />
      </TabPanel>
    </div>
  );
};

const PlacesContent = ({
  showDataSources,
  setShowDataSources,
  setLoadedFirePlaceStates,
  setShowPlaces,
  setShowJourneys,
  setShowRoutes,
  showPlaces,
  showJourneys,
  showRoutes,
  centerLocation,
  zoomLevel,
  group,
  map,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const uid = localStorage.getItem("uid");
  const settings = useSettings();
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const handleBoxChange = event => {
    if (event.target.name === "showPlaces") {
      setShowPlaces("showPlaces", event.target.checked);
    }
    if (event.target.name === "showJourneys") {
      setShowJourneys("showJourneys", event.target.checked);
    }
    if (event.target.name === "showRoutes") {
      setShowRoutes("showRoutes", event.target.checked);
    }
  };
  const handleEvent = useCallback((dataSource, boolean) => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "dataSourceUsed",
              data: `${dataSource}: ${boolean}`,
              group: group?.id,
              uid: uid,
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataBoxChange = event => {
    setShowDataSources({
      ...showDataSources,
      [event.target.name]: event.target.checked,
    });
    if (event.target.name === "firePlaces") {
      localStorage.setItem("firePlaces", event.target.checked);
      handleEvent("firePlaces", event.target.checked);
      if (event.target.checked === false) {
        setLoadedFirePlaceStates([]);
      }
    }
    if (event.target.name === "servicePlaces") {
      localStorage.setItem("servicePlaces", event.target.checked);
      handleEvent("servicePlaces", event.target.checked);
    }
    if (event.target.name === "vessels") {
      localStorage.setItem("vessels", event.target.checked);
      handleEvent("vessels", event.target.checked);
    }
    if (event.target.name === "poriNaturePlaces") {
      localStorage.setItem("poriNaturePlaces", event.target.checked);
      handleEvent("poriNaturePlaces", event.target.checked);
    }
  };

  return (
    <>
      <FormGroup>
        <FormLabel>{t("Places")}</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              checked={showJourneys}
              onChange={handleBoxChange}
              name="showJourneys"
              color="primary"
              className={classes.checkButtons}
            />
          }
          label={t("Journeys")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPlaces}
              onChange={handleBoxChange}
              name="showPlaces"
              className={classes.checkButtons}
            />
          }
          label={t("Destinations")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showRoutes}
              onChange={handleBoxChange}
              name="showRoutes"
              color="primary"
              className={classes.checkButtons}
            />
          }
          label={t("Journeys paths")}
        />
      </FormGroup>
      <hr style={{ borderStyle: "outset" }}></hr>
      <div>
        <FormGroup>
          <FormLabel>{t("Addit. Places")}</FormLabel>
          {group?.dataSources.find(group => group?.name === "Tulikartta") && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showDataSources?.firePlaces}
                  onChange={handleDataBoxChange}
                  name="firePlaces"
                  color="primary"
                />
              }
              label={t("Fire map")}
            />
          )}
          {group?.dataSources.find(
            group => group?.name === "Porin luontokohteet"
          ) && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showDataSources?.poriNaturePlaces}
                  onChange={handleDataBoxChange}
                  name="poriNaturePlaces"
                  color="primary"
                />
              }
              label={t("Natureplaces(Pori)")}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={showDataSources?.servicePlaces}
                onChange={handleDataBoxChange}
                name="servicePlaces"
                color="primary"
              />
            }
            label={t("Services")}
          />
          {group?.vessels?.length ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showDataSources?.vessels}
                  onChange={handleDataBoxChange}
                  name="vessels"
                  color="primary"
                />
              }
              label={t("Vessels")}
            />
          ) : null}
        </FormGroup>
      </div>
    </>
  );
};

const LayersContent = ({ map }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [changingLayer, setChangingLayer] = useState(false);
  const [value, setValue] = useState(
    localStorage.getItem("mapLayer") || "default"
  );

  const checkAllLayers = useCallback(() => {
    map.eachLayer(function (layer) {
      if (layer._url) map.removeLayer(layer);
    });
  }, [map]);
  const handleChange = event => {
    setChangingLayer(true);
    setValue(event.target.value);
  };
  useEffect(() => {
    if (changingLayer && value === "default" && map) {
      checkAllLayers();
      map.addLayer(Layer1);
      localStorage.setItem("mapLayer", "default");
      setChangingLayer(false);
    } else if (changingLayer && value === "satellite" && map) {
      checkAllLayers();
      map.addLayer(Layer2);
      localStorage.setItem("mapLayer", "satellite");
      setChangingLayer(false);
    } else if (changingLayer && value === "highvariation" && map) {
      checkAllLayers();
      map.addLayer(Layer3);
      localStorage.setItem("mapLayer", "highvariation");
      setChangingLayer(false);
    } else if (changingLayer && value === "cycleroutes" && map) {
      checkAllLayers();
      map.addLayer(Layer4);
      localStorage.setItem("mapLayer", "cycleroutes");
      setChangingLayer(false);
    }
  }, [value, map, checkAllLayers, changingLayer]);

  return (
    <div className={classes.checkBoxContainer}>
      <FormControl>
        <FormLabel>{t("Map templates")}</FormLabel>
        <RadioGroup
          aria-label="templates"
          name="templates"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="default"
            control={<Radio className={classes.radioButtons} />}
            label={t("Default")}
            //classes={{ root: classes.radioButtons }}
          />
          <FormControlLabel
            value="satellite"
            control={<Radio classes={{ root: classes.radioButtons }} />}
            label={t("Satellite")}
            className={classes.radioButtons}
          />
          <FormControlLabel
            value="highvariation"
            control={<Radio classes={{ root: classes.radioButtons }} />}
            label={t("High variation")}
            className={classes.radioButtons}
          />
          <FormControlLabel
            value="cycleroutes"
            control={<Radio classes={{ root: classes.radioButtons }} />}
            label={t("Cycle Routes")}
            className={classes.radioButtons}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};
