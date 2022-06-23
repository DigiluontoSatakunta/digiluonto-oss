import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Slide, Paper, ClickAwayListener } from "@material-ui/core";

import { LinearProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
const useStyles = makeStyles(theme => ({
  root: {
    "&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)": {
      backgroundColor: "#f6ce95",
      height: 15,
      width: "100%",
      marginTop: 15,
      marginBottom: 15,
    },
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "#f6ce95",
    },
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#f0ad4e",
    },
    "& .MuiLinearProgress-dashedColorPrimary": {
      backgroundImage:
        "radial-gradient(#f6ce95 0%, #f6ce95 16%, transparent 42%)",
    },
  },
  paper: {
    height: "auto",
    background: "white",
    zIndex: 1000,
    position: "relative",
    transform: "translateY(-50%)",
    margin: theme.spacing(3),
    top: "50%",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "flex-end",
    flexDirection: "row",
    display: "flex",
    padding: 10,
  },
}));
export const AccuracyDialog = ({
  locationAccuracy,
  setAccuracyPopup,
  setOpenAccuracyDialog,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = React.useState(false);

  const handleClickAway = () => {
    setOpen(false);
    setOpenAccuracyDialog(false);
    if (checked) {
      localStorage.setItem("accuracyPopup", true);
      setAccuracyPopup(true);
    }
  };
  const handleClose = () => {
    setOpenAccuracyDialog(false);
    setOpen(false);
    if (checked) {
      localStorage.setItem("accuracyPopup", true);
      setAccuracyPopup(true);
    }
  };
  const handleChange = event => {
    setChecked(event.target.checked);
    setAccuracyPopup(event.target.checked);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          <Paper elevation={4} className={classes.paper}>
            <h3
              style={{ maxWidth: "100%", textAlign: "center", margin: "1em" }}
            >
              {t("Detected weak Location")}
            </h3>
            {t(
              "We've detected poor accuracy in your location. Location accuracy may be affected by tall buildings nearby or by using the app indoors."
            )}
            {locationAccuracy && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    color="primary"
                    value={locationAccuracy >= 100 ? 100 : locationAccuracy}
                    classes={{
                      root: classes.root,
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 35, marginBottom: "10px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("Accuracy ")}
                    {Math.round(locationAccuracy)}m
                  </Typography>
                </Box>
              </Box>
            )}
            <br />
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label={t("Don't show again")}
            />
            <Button
              onClick={handleClose}
              color="primary"
              data-cy="btn-loc-agree"
              autoFocus
            >
              {t("OK")}
            </Button>
          </Paper>
        </div>
      </Slide>
    </ClickAwayListener>
  );
};
