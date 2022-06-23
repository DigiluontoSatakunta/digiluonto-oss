import React, { useState, useEffect, useCallback } from "react";
import { Snackbar, Slide, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import "../mapcss/Mainmap.css";
import compassImg from "../../../assets/compassperimeter.png";
import compassImg2 from "../../../assets/compassperimeterArr.png";
import { getDistance } from "geolib";

const useStyles = makeStyles(theme => ({
  snackBar: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(7),
    zIndex: "1200",
    color: "white",
    display: "flex",
  },
  compassImg: {
    width: "105px",
    position: "absolute",
    right: "60px",
  },
}));

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}

export default function Compass({ poi, setPoi, location, orientation }) {
  const classes = useStyles();
  const [distanceToCompass, setDistanceToCompass] = useState();
  const [compassOrientation, setCompassOrientation] = useState();

  const calcDegreeToPoint = useCallback(
    (latitude, longitude) => {
      const phiK = (poi.geoJSON.geometry.coordinates[1] * Math.PI) / 180.0;
      const lambdaK = (poi.geoJSON.geometry.coordinates[0] * Math.PI) / 180.0;
      const phi = (latitude * Math.PI) / 180.0;
      const lambda = (longitude * Math.PI) / 180.0;
      const psi =
        (180.0 / Math.PI) *
        Math.atan2(
          Math.sin(lambdaK - lambda),
          Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
      return Math.round(psi);
    },
    [poi.geoJSON.geometry.coordinates]
  );

  useEffect(() => {
    if (poi) {
      const distance = getDistance(
        {
          latitude: poi.geoJSON.geometry.coordinates[1],
          longitude: poi.geoJSON.geometry.coordinates[0],
        },
        {
          latitude: location?.[0],
          longitude: location?.[1],
        }
      );

      setDistanceToCompass(distance);

      let arrowIcon = document.getElementsByClassName("compass-icon")[0];
      let arrowIcon2 = document.getElementsByClassName("compass-arrow")[0];

      const poiDirection = calcDegreeToPoint(location[0], location[1]);
      setCompassOrientation(poiDirection);

      arrowIcon.style.setProperty(
        "--arrow-direction2",
        +(-90 + poiDirection) + "deg"
      );
      arrowIcon2.style.setProperty("--arrow-direction3", +-orientation + "deg");
    }
  }, [location, poi, compassOrientation, calcDegreeToPoint, orientation]);

  const closeCompass = (event, reason) => {
    if (reason === "clickaway") return;

    setPoi(0);
  };

  return (
    <Snackbar
      className={classes.snackBar}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      TransitionComponent={TransitionRight}
      open={!!poi}
      onClose={closeCompass}
      message={
        distanceToCompass < 1000
          ? poi.name + " Etäisyys: " + parseInt(distanceToCompass) + "m"
          : poi.name +
            " Etäisyys: " +
            (distanceToCompass / 1000).toFixed(1) +
            "km"
      }
      action={
        <>
          <div className="compass-icon"></div>
          <img className={classes.compassImg} alt="compass" src={compassImg} />
          <img className="compass-arrow" alt="compass" src={compassImg2} />

          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeCompass}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    ></Snackbar>
  );
}
