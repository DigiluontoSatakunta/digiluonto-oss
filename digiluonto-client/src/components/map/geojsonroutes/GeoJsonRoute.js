import React, { memo, useCallback, useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import "../mapcss/Mainmap.css";
import { max, min } from "lodash";
import { useQuery } from "@apollo/client";
import { JOURNEYSBYLOCATION } from "../../../gql/queries/Map";

export const GeoJsonRoute = memo(
  ({
    refetchLocation,
    distance,
    activeJourney,
    semiActiveJourney,
    setGeoJsonInfo,
    locale,
    group,
  }) => {
    const [geoJsonArray] = useState([]);

    const pointToLayer = feature => {};
    const onEachFeature = (feature, layer) => {
      layer.on("click", function (e) {
        let latlngs = layer.getLatLngs();
        let altitudes = [];
        latlngs.filter(({ alt }) => altitudes.push(alt));

        let highestAlt = max(altitudes);
        let lowestAlt = min(altitudes);
        let heightDifference = highestAlt - lowestAlt;
        setGeoJsonInfo({
          position: [e.latlng.lat, e.latlng.lng],
          highestAlt: highestAlt,
          lowestAlt: lowestAlt,
          heightDifference: heightDifference,
        });
      });
    };
    const { data: journeysData, refetch: refetchJourneys } = useQuery(
      JOURNEYSBYLOCATION,
      {
        variables: {
          latitude: parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE),
          longitude: parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE),
          distance: 0,
          group: group?.id,
          locale,
        },
      }
    );

    const checkArray = useCallback(() => {
      journeysData?.journeysByLocation?.forEach(feature => {
        const journeyIds = geoJsonArray.map(exists => exists.id);
        const routesToShow = feature?.places?.filter(
          place => place.public === true
        );
        if (
          !journeyIds.includes(feature.id) &&
          feature.route !== null &&
          (routesToShow.length >= 1 || group.id === feature?.ownerGroup?.id)
        )
          geoJsonArray.push(feature);
      });
    }, [journeysData, geoJsonArray, group]);
    useEffect(() => {
      refetchJourneys({
        latitude: parseFloat(refetchLocation[0]),
        longitude: parseFloat(refetchLocation[1]),
        distance: distance || 0,
      });

      if (journeysData?.journeysByLocation?.length !== geoJsonArray.length)
        checkArray();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkArray]);
    useEffect(() => {
      const fetchingTimeout = setTimeout(() => {
        refetchJourneys({
          latitude: parseFloat(refetchLocation[0]),
          longitude: parseFloat(refetchLocation[1]),
          distance: distance || 0,
        });
      }, 600);
      return () => clearInterval(fetchingTimeout);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchLocation, distance, refetchJourneys]);
    return !geoJsonArray
      ? null
      : geoJsonArray.map((journey, i) => {
          if (activeJourney?.id === journey?.id && journey?.route) {
            return (
              <GeoJSON
                key={i}
                style={{ color: "#800001", weight: "2" }}
                data={journey.route}
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
              />
            );
          }
          if (
            journey?.route &&
            semiActiveJourney?.id === journey?.id &&
            !activeJourney
          ) {
            return (
              <GeoJSON
                key={i}
                style={{
                  color: "#800001",
                  weight: "2",
                  // opacity: activeJourney ? 0 : 1,
                }}
                data={journey.route}
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
              />
            );
          }
          if (!activeJourney || semiActiveJourney) {
            return (
              <GeoJSON
                key={i}
                style={{
                  color: "#1665c0a1",
                  weight: "2",
                  opacity: activeJourney || semiActiveJourney ? 0 : 1,
                }}
                data={journey.route}
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
              />
            );
          } else return null;
        });
  }
);
