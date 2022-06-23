import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { makeStyles } from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  ReactAudioPlayer: {
    display: "flex",
    padding: theme.spacing(1),
    boxSizing: "border-box",
  },
  audioTag: {
    width: "100%",
  },
}));

export const AudioContent = ({ link, loop }) => {
  const classes = useStyles();

  return (
    <div className={classes.ReactAudioPlayer}>
      <ReactAudioPlayer
        className={classes.audioTag}
        src={link}
        controls
        loop={loop || false}
      />
    </div>
  );
};
