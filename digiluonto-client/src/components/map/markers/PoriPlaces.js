import React from "react";
import { useQuery } from "@apollo/client";
import { Marker, Popup } from "react-leaflet";
import { makeStyles } from "@material-ui/core/styles";
import { MapIcon } from "../icons/MapIcon";

import { PORI_LUONTOKOHTEET } from "../../../gql/queries/PoriLuontoKohteet";

const useStyles = makeStyles(theme => ({
  popupPhotoContainer: {
    maxHeight: 150,
    height: 150,
    overflow: "hidden",
    position: "relative",
    "&:empty": {
      display: "none",
    },
    "&:hover": {
      backgroundColor: "#99f",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background:
        "linear-gradient(0deg, rgb(0 0 0 / 54%), transparent, rgb(0 0 0 / 52%))",
    },
  },
  popupPhoto: {
    width: "100%",
    height: "auto",
    display: "block",
    margin: 0,
    objectFit: "cover",
    objectPosition: "center",
  },
  popupTitle: {
    margin: 0,
  },
  popupDescription: {
    margin: "8px 0 0 !important",
    boxSizing: "border-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 4,
  },
  popupContent: {
    minWidth: 30,
    padding: 15,
  },
  activeLinkBtn: {
    float: "right",
    minWidth: "60px",
    height: "25px",
    marginBottom: "5px",
    marginRight: "5px",
    textDecoration: "none",
    color: `${theme.palette.primary.main} !important`,
  },
}));
export const PoriPlaces = ({ markerRef }) => {
  const classes = useStyles();
  const { data } = useQuery(PORI_LUONTOKOHTEET, { fetchPolicy: "cache-first" });

  return !data?.PoriLuontokohteet_luontokohteet?.features
    ? null
    : data?.PoriLuontokohteet_luontokohteet?.features?.map((place, i) => {
        if (place?.geometry?.coordinates) {
          return (
            <Marker
              key={i}
              position={[...place?.geometry?.coordinates].reverse()}
              radius={20}
              icon={MapIcon("postal_code", "blueIcon")}
              ref={markerRef}
            >
              <Popup autoPan={true} autoClose={true}>
                {place?.properties?.pic_url && (
                  <div className={classes.popupPhotoContainer}>
                    <img
                      alt={place.name}
                      key={place.id}
                      src={`${place?.properties?.pic_url}`}
                      className={classes.popupPhoto}
                    />
                  </div>
                )}
                <div className={classes.popupContent}>
                  <h3 className={classes.popupTitle}>
                    {place?.properties.nimi}
                  </h3>
                  <p className={classes.popupDescription}>
                    {place?.properties?.kuvaus}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        } else return null;
      });
};
