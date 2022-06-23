import React from "react";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/";
import { SENDEVENT } from "../../../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { useSettings } from "../../../settings/SettingsContext";
import { crawlers } from "../../../../utils/crawlers";
const useStyles = makeStyles(theme => ({
  playerWrapper: {
    position: "relative",
    height: 0,
    paddingBottom: "56.25%",
    marginBottom: theme.spacing(1),
    overflow: "hidden",
    "@supports (aspectRatio: initial)": {
      aspectRatio: "16 / 9",
      padding: 0,
      height: "auto",
      overflow: "auto",
    },
  },
  ReactPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
  },
}));

export const VideoContent = ({ link, group, place, uid }) => {
  const classes = useStyles();
  const settings = useSettings();
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });
  const handleMediaEvent = type => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "mediaOpened",
              data: `type: video`,
              place: place?.id,
              group: group?.id,
              uid: uid,
            },
          },
        },
      });
    }
  };
  return (
    <>
      <div className={classes.playerWrapper}>
        <ReactPlayer
          onPlay={() => handleMediaEvent()}
          className={classes.ReactPlayer}
          url={link?.url}
          width="100%"
          height="100%"
          controls={true}
        />
      </div>
    </>
  );
};
