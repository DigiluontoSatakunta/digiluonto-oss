import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LockIcon from "@material-ui/icons/Lock";
import Fab from "@material-ui/core/Fab";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HelpIcon from "@material-ui/icons/Help";
import CheckIcon from "@material-ui/icons/Check";
import AppBar from "@material-ui/core/AppBar";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Container, CardMedia, Typography } from "@material-ui/core";

import currentIcon from "../../../assets/currentIcon.svg";
import semiactiveMarker from "../../../assets/semiactivemarker.svg";
import blueMarker from "../../../assets/blueMarker.svg";
import journeyMarker from "../../../assets/journeyMarker.svg";
import userMarker from "../../../assets/userMarker.svg";

import { About } from "../../info/AboutContent";
import { Help } from "../../info/HelpContent";
const useStyles = makeStyles(theme => ({
  drawer: {
    "& .MuiDrawer-paper": {
      height: "calc(100% - 56px)",
      //background: "#fff0",
    },
  },
  tab1: {
    flex: "1 0 auto",
    margin: 0,
    minWidth: "100%",
    padding: theme.spacing(3),
  },
  BoxContainer: {
    display: "flex",
    marginTop: 10,
    alignItems: "center",
    height: 50,
  },
  iconText: {
    marginLeft: 15,
  },
  fab: {
    position: "absolute",
    top: theme.spacing(12),
    left: theme.spacing(2),
    zIndex: 400,
    width: 35,
    height: 35,
    color: theme.palette.icon.main,
  },
  media: {
    width: "2rem",
  },
  toolbar: {
    //minHeight: "56px !important",
    gridTemplateColumns: "auto 96px",
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: theme.palette.icon.main,
    },
  },
}));

export const MarkerHelperFab = ({ setOpenDrawer, setOpenJourneyDrawer }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";

  const toggleDrawer = open => event => {
    setOpenDrawer(false);
    setOpenJourneyDrawer(false);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  return (
    <div>
      <Fab
        color={color}
        aria-label="center"
        className={classes.fab}
        onClick={toggleDrawer(true)}
      >
        <HelpIcon fontSize="small" />
      </Fab>

      <Drawer
        className={classes.drawer}
        anchor={"left"}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: "90vw" }} role="presentation">
          {/* <HelpContent /> */}
          <HelperTabs />
        </Box>
      </Drawer>
    </div>
  );
};

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
const HelperTabs = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        {/* <Toolbar className={classes.toolBar}> */}
        <Tabs
          style={{ minHeight: "56px" }}
          className={classes.toolbar}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          TabIndicatorProps={{ children: <span /> }}
        >
          <Tab
            style={{ color: "white", height: "56px" }}
            label={t("Symbols")}
            {...a11yProps(0)}
          />
          <Tab
            style={{ color: "white", height: "56px" }}
            label={t("Guide")}
            {...a11yProps(1)}
          />
          <Tab
            style={{ color: "white", height: "56px" }}
            label={t("About")}
            {...a11yProps(2)}
          />
        </Tabs>
        {/* </Toolbar> */}
      </AppBar>
      <TabPanel value={value} index={0}>
        <HelpContent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Help />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <About />
      </TabPanel>
    </div>
  );
};

const HelpContent = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Container component="div" className={classes.tab1} maxWidth="xs">
      <Box elevation={4} className={classes.paper}>
        <Typography
          component="h5"
          variant="h5"
          style={{ position: "relative", left: "-20px" }}
        >
          {t("Värimerkitykset")}
        </Typography>
        <Box className={classes.BoxContainer}>
          {/* <img className={classes.iconImage} alt="icon" src={GreenHelp} /> */}
          <CardMedia
            className={classes.media}
            component="img"
            src={semiactiveMarker}
          />
          <Typography component="p" className={classes.iconText}>
            {t("Active journey icon")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <CardMedia
            className={classes.media}
            component="img"
            src={currentIcon}
          />

          <Typography component="p" className={classes.iconText}>
            {t("Active place icon")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <CardMedia
            className={classes.media}
            component="img"
            src={blueMarker}
          />
          <Typography component="p" className={classes.iconText}>
            {t("Place icon")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <CardMedia
            className={classes.media}
            component="img"
            src={journeyMarker}
          />
          <Typography component="p" className={classes.iconText}>
            {t("Journey icon")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <CardMedia
            className={classes.media}
            component="img"
            src={userMarker}
          />
          <Typography component="p" className={classes.iconText}>
            {t("User icon")}
          </Typography>
        </Box>
        <Typography
          component="h5"
          variant="h5"
          style={{ position: "relative", left: "-20px", marginTop: "20px" }}
        >
          {t("Symbolien merkitykset")}
        </Typography>
        <Box className={classes.BoxContainer}>
          <LockIcon className={classes.media} />
          <Typography component="p" className={classes.iconText}>
            {t("Available in location")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <VpnKeyIcon className={classes.media} />
          <Typography className={classes.iconText}>
            {t("Enter the key to open the content")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <CheckIcon className={classes.media} />
          <Typography className={classes.iconText}>
            {t("Visited in location")}
          </Typography>
        </Box>
        <Box className={classes.BoxContainer}>
          <QrCodeScannerIcon className={classes.media} />
          <Typography style={{ marginLeft: 22 }}>
            {t("Open the content by QR code scanner")}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
