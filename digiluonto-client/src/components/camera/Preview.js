import React, { useCallback, useEffect, useRef, useState } from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Paper from "@material-ui/core/Paper";
import "leaflet/dist/leaflet.css";
import Fab from "@material-ui/core/Fab";
import Slide from "@material-ui/core/Slide";
import ShareIcon from "@material-ui/icons/Share";
import GetAppIcon from "@material-ui/icons/GetApp";
import { makeStyles } from "@material-ui/core/styles";
import { useGroup } from "../group/GroupContext";

import "./DisablePageReload.css";
import kuva from "./digiluonto.png";

const useStyles = makeStyles(theme => ({
  checkBoxes: {
    display: "block",
    width: "100%",
    float: "left",
    marginBottom: "1rem",
  },
  pre: {
    width: "88%",
    display: "block",
    height: "100%",
    padding: "10px 10px 0px 10px",
  },
  checkBoxesRight: {
    float: "right",
    padding: "0",
    position: "relative",
    top: "-3px",
  },
  fab4: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: "401",
    color: "white",
  },
  previewContainer: {
    zIndex: "200",
    width: "100%",
    height: "100%",
    background: "rgba(5, 0, 0, 0.84)",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  paper: {
    width: "100%",
    height: "100%",
    background: "#ffffffb0",
    zIndex: 1000,
    position: "absolute",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  fabShare: {
    bottom: theme.spacing(2),
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  fabDownload: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  buttons: {
    width: "100%",
    height: "10%",
    position: "absolute",
    bottom: "0",
    zIndex: "600",
  },
}));

export default function Preview(props) {
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);
  const classes = useStyles();
  const { imageState, previewState, setPreviewState, webcamRef } = props;

  const group = useGroup();

  const canvasStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };
  const canvasStyle2 = {
    width: "100%",
    height: "100%",
    //objectFit: "cover",
    position: "absolute",
    zIndex: "500",
    top: "0",
    left: "0",
    //transform: "translateX(-50%)",
  };

  //const stampImage = group.cover?.formats?.thumbnail?.url;

  const [picShare, setPicShare] = useState();

  const updateCanvas = useCallback(() => {
    const videoSize = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stamp = new Image();
    //stamp.src = `https://${process.env.REACT_APP_API_DOMAIN}${stampImage}`;
    stamp.src = kuva;

    const picture = new Image();
    picture.src = imageState;
    picture.width = videoSize.videoWidth;
    picture.height = videoSize.videoHeight;

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    canvas.width = videoSize.videoWidth;
    canvas.height = videoSize.videoHeight;

    const left = canvas.width / 2 - screenWidth / 2;
    const top = canvas.height / 2 - screenHeight / 2.3;

    stamp.onload = function () {
      ctx.drawImage(picture, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(stamp, left, top, screenWidth / 2, screenHeight / 8);
      const picToShare = canvas.toDataURL("image/jpg");

      setPicShare(picToShare);
    };
  }, [imageState, webcamRef]);

  useEffect(() => {
    if (canvasRef && webcamRef) updateCanvas();
  }, [canvasRef, updateCanvas, webcamRef]);

  const shareImage = () => {
    function dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    const data = {
      title: group?.name,
      text: group?.welcome,
    };

    // const canvas = canvasRef.current;
    // const dataURL = canvas.toDataURL("image/jpg");

    //const dataURL = picShare
    const imageFile = dataURLtoFile(picShare, "image.png");
    data.files = [imageFile];

    //const file = new File([dataURL], 'Digiluonto.png', { type: dataURL.type });

    if (navigator.canShare && navigator.canShare(data)) {
      navigator
        .share(data)
        .then(() => console.log("Toimii"))
        .catch(err => console.log(err));
    } else {
      // console.log(data)
      alert("Laitteesi ei tue jakoa");
    }
  };

  const downloadImage = () => {
    const url = picShare;
    let a = document.createElement("a");
    a.setAttribute("download", "image.png");
    a.download = "Digiluonto";
    a.href = url;
    a.click();
  };

  return (
    <Slide
      direction="left"
      timeout={500}
      in={previewState}
      mountOnEnter
      unmountOnExit
    >
      <Paper elevation={4} className={classes.paper}>
        <div className={classes.previewContainer}>
          <canvas style={canvasStyle} ref={canvasRef}></canvas>
          <canvas style={canvasStyle2} ref={canvasRef2}></canvas>
        </div>
        <div className={classes.buttons}>
          <Fab
            color="primary"
            aria-label="center"
            size="small"
            className={classes.fab}
            onClick={() => setPreviewState(false)}
          >
            <ArrowForwardIcon />
          </Fab>
          <Fab
            color="primary"
            aria-label="center"
            size="medium"
            className={classes.fabShare}
            onClick={shareImage}
          >
            <ShareIcon />
          </Fab>
          <Fab
            color="primary"
            aria-label="center"
            size="small"
            className={classes.fabDownload}
            onClick={downloadImage}
          >
            <GetAppIcon />
          </Fab>
        </div>
      </Paper>
    </Slide>
  );
}
