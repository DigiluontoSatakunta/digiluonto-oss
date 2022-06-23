import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  debugConsole: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 400,
    padding: "4px",
    backdropFilter: "blur(5px)",
  },
}));

export const DebugConsole = memo(({ location, locationAccuracy }) => {
  const classes = useStyles();

  return (
    <div className={classes.debugConsole}>
      {Array.isArray(location) && (
        <>
          {/* accuracy: {locationAccuracy ? locationAccuracy : "ei sijaintia"} */}
          lat. {parseFloat(location?.[0]).toFixed(5)}, lng.{" "}
          {parseFloat(location?.[1]).toFixed(5)}
        </>
      )}
    </div>
  );
});
