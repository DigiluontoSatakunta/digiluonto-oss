import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./LightBox.css";

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: "90%",
    left: "50%",
    height: "auto",
    maxHeight: "70%",
    overflow: "auto",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    margin: 0,
    boxShadow: theme.shadows[5],
  },
}));

export const LightBox = ({ includesImageUrl }) => {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      {includesImageUrl && (
        <TransformWrapper>
          <TransformComponent>
            <img
              style={{ width: "100%" }}
              alt="contentImage"
              src={includesImageUrl}
              title="Photo"
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
};
