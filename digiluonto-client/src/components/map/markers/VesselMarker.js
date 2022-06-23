import React, { memo, useRef, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { MapIcon } from "../icons/MapIcon";
import "../mapcss/Mainmap.css";

const useStyles = makeStyles(theme => ({
  popupTitle: {
    margin: 0,
  },
  popupDetails: {
    margin: "8px 0 0 !important",
    boxSizing: "border-box",
  },
  details: {
    "& tr td:nth-child(1)": {
      fontWeight: "bold",
    },
  },
  popupContent: {
    minWidth: "30px",
    padding: "15px",
  },
  activeLinkBtn: {
    float: "right",
    minWidth: "60px",
    height: "25px",
    marginBottom: "5px",
    textDecoration: "none",
    color: `${theme.palette.primary.main} !important`,
  },
}));

export const VesselMarker = memo(({ vessel, data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const popupRef = useRef();
  const [direction, setDirection] = useState("");
  const { geometry, mmsi, properties } =
    data?.vesselLocationsByMssiAndTimestamp?.features[0];
  useEffect(() => {
    if (properties) {
      if (properties.heading === 0) setDirection(t("North"));
      if (properties.heading === 90) setDirection(t("East"));
      if (properties.heading === 180) setDirection(t("South"));
      if (properties.heading === 270) setDirection(t("West"));
      if (properties.heading > 0 && properties.heading < 90)
        setDirection(t("NorthEast"));
      if (properties.heading > 90 && properties.heading < 180)
        setDirection(t("SouthEast"));
      if (properties.heading > 180 && properties.heading < 270)
        setDirection(t("SouthWest"));
      if (properties.heading > 270 && properties.heading < 360)
        setDirection(t("NorthWest"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  return (
    <>
      {geometry ? (
        <Marker
          key={mmsi}
          position={[geometry?.coordinates[1], geometry?.coordinates[0]]}
          radius={20}
          icon={MapIcon("sailing", "vesselIcon")}
        >
          <Popup ref={popupRef} autoPan={true} autoClose={true}>
            <div className={classes.popupContent}>
              <h3 className={classes.popupTitle}>{vessel?.name}</h3>
              <div className={classes.popupDetails}>
                <table className={classes.details}>
                  <tbody>
                    <tr>
                      <td>{t("heading")}</td>
                      <td>
                        {properties.heading}° {direction}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("sog")}</td>
                      <td>
                        {properties.sog} {t("knots")}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("timestampExternal")}</td>
                      <td>
                        {new Date(
                          properties.timestampExternal
                        ).toLocaleTimeString("fi-FI")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Popup>
        </Marker>
      ) : null}
    </>
  );
});
