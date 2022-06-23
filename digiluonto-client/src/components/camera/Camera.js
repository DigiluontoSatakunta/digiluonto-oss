import React, { useRef, useState } from "react";

import Webcam from "react-webcam";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CameraIcon from "@material-ui/icons/Camera";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import Preview from "./Preview";
import { AllowCamera } from "../../utils/AllowCamera";

import { useGroup } from "../group/GroupContext";

const useStyles = makeStyles(theme => ({
  cameraView: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  tempPic: {
    position: "fixed",
    display: "flex",
    right: "0",
    width: "20%",
    minWidth: "130px",
    minHeight: "130px",
    height: "31%",
    background: "rgba(0, 0, 0, 0)",
    zIndex: "100",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0",
    boxSizing: "border-box",
    bottom: theme.spacing(7),
    flexDirection: "column-reverse",
  },
  tempPicStyle: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fab1: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: "50%",
    zIndex: "401",
    color: theme.palette.icon.main,
    transform: "translateX(-50%)",
  },
  fab2: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  fabPreview: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "401",
    color: theme.palette.icon.main,
  },
}));

const Camera = () => {
  const webcamRef = useRef(null);
  const classes = useStyles();

  const group = useGroup();
  const { t } = useTranslation();

  const [facingMode, setFacingMode] = useState("user");
  const [imageState, setImageState] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  const [previewState, setPreviewState] = useState(false);

  const [mediaError, setMediaError] = useState();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const changeCamera = () => {
    setFacingMode(prevState =>
      prevState === "user" ? { exact: "environment" } : "user"
    );
  };

  const setError = () => {
    setMediaError(true);
  };

  const capture = event => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setImageState(imageSrc);
    setSlideIn(event.currentTarget);
  };
  const handleClickAway = () => {
    setSlideIn(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {t("Camera")} | {group?.name}
        </title>
        <meta name="description" content={group?.welcome} />
      </Helmet>
      {mediaError ? (
        <AllowCamera />
      ) : (
        <Webcam
          className={classes.cameraView}
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          onUserMediaError={setError}
          videoConstraints={{
            ...videoConstraints,
            facingMode,
          }}
        />
      )}
      <Fab
        color="primary"
        aria-label="center"
        size="small"
        className={classes.fab2}
        onClick={changeCamera}
      >
        <SwapHorizIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="center"
        size="large"
        className={classes.fab1}
        onClick={capture}
      >
        <CameraIcon style={{ fontSize: "2rem" }} />
      </Fab>
      {slideIn && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Card className={classes.tempPic}>
            <img
              className={classes.tempPicStyle}
              src={imageState}
              alt="alt"
            ></img>
            <Fab
              color="primary"
              aria-label="center"
              size="small"
              className={classes.fabPreview}
              onClick={() => setPreviewState(true)}
            >
              <VisibilityIcon />
            </Fab>
          </Card>
        </ClickAwayListener>
      )}
      {previewState && (
        <Preview
          setImageState={setImageState}
          imageState={imageState}
          webcamRef={webcamRef}
          previewState={previewState}
          setPreviewState={setPreviewState}
        />
      )}
    </>
  );
};

export default Camera;
