import React, { memo, useCallback, useState, useEffect } from "react";

import { Marker, Popup } from "react-leaflet";
import { makeStyles } from "@material-ui/core";
import { states } from "../../../constants";
import { MapIcon } from "../icons/MapIcon";
import { useQuery } from "@apollo/client";
import { FIREPLACESBYLOCATION } from "../../../gql/queries/Map";
const useStyles = makeStyles(theme => ({
  popupTitle: {
    margin: 0,
  },
  popupDescription: {
    margin: "8px 0 0 !important",
    boxSizing: "border-box",
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 4,
  },
  popupContent: {
    minWidth: "30px",
    padding: 15,
  },
}));

export const FirePlaces = memo(
  ({
    map,
    markerRef,
    centerLocation,
    loadedFirePlaceStates,
    setLoadedFirePlaceStates,
  }) => {
    const classes = useStyles();
    const [fireplaceCounty, setFirePlaceCounty] = useState("Satakunta");
    const [firePlaceMarkers] = useState([]);
    const { data } = useQuery(FIREPLACESBYLOCATION, {
      variables: {
        fireplaceCounty,
      },
      fetchPolicy: "cache-first",
    });
    const checkAreaOfRegion = useCallback(() => {
      let string = "";

      Object.entries(states).forEach(entry => {
        const [state, value] = entry;
        if (
          centerLocation[0] > value[0] &&
          centerLocation[0] < value[1] &&
          centerLocation[1] > value[2] &&
          centerLocation[1] < value[3]
        ) {
          string = state;
          setFirePlaceCounty(state);
        }
      });
      if (!loadedFirePlaceStates.includes(string)) {
        if (
          data.Tulikartta_fireplaces.features[0].properties.maakunta.toLowerCase() ===
          string.toLowerCase()
        ) {
          data.Tulikartta_fireplaces.features.forEach(e => {
            firePlaceMarkers.push(e);
          });
          setLoadedFirePlaceStates([...loadedFirePlaceStates, string]);
        }
      }
    }, [
      data,
      centerLocation,
      loadedFirePlaceStates,
      setLoadedFirePlaceStates,
      firePlaceMarkers,
    ]);

    useEffect(() => {
      if (map && centerLocation && data) {
        checkAreaOfRegion();
      }
    }, [data, centerLocation, map, checkAreaOfRegion]);

    return !firePlaceMarkers
      ? null
      : firePlaceMarkers?.map((place, i) => {
          if (place?.geometry?.coordinates) {
            return (
              <Marker
                key={i}
                position={place?.geometry?.coordinates}
                radius={20}
                icon={MapIcon("fireplace", "firePlaceIcon")}
                ref={markerRef}
              >
                <Popup autoPan={true} autoClose={true}>
                  <div className={classes.popupContent}>
                    <h3 className={classes.popupTitle}>
                      {place?.properties?.name}
                    </h3>
                    <p className={classes.popupDescription}>
                      {place?.properties?.tyyppi}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          } else return null;
        });
  }
);
