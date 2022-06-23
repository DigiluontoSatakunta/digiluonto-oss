import React, { memo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Marker } from "react-leaflet";

import { MapIcon } from "../icons/MapIcon";

import { SERVICEPLACESBYLOCATION } from "../../../gql/queries/Map";

export const ServicePlaces = memo(
  ({
    markerRef,
    locale,
    refetchLocation,
    distance,
    setClickedPopup,
    setOpenDrawer,
  }) => {
    const { data, refetch } = useQuery(SERVICEPLACESBYLOCATION, {
      variables: {
        latitude: parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE),
        longitude: parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE),
        distance: 0,
        locale,
      },
      fetchPolicy: "cache-first",
    });

    useEffect(() => {
      refetch({
        latitude: parseFloat(refetchLocation[0]),
        longitude: parseFloat(refetchLocation[1]),
        distance: distance || 0,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const fetchingTimeout = setTimeout(() => {
        refetch({
          latitude: parseFloat(refetchLocation[0]),
          longitude: parseFloat(refetchLocation[1]),
          distance: distance || 0,
        });
      }, 600);
      return () => clearInterval(fetchingTimeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchLocation, distance, refetch]);

    return (
      <>
        {data ? (
          <>
            {data?.servicesByLocation?.map((place, i) => (
              <Marker
                key={i}
                position={[place?.latitude, place?.longitude]}
                radius={20}
                icon={MapIcon(place?.icon, "servicesIcon")}
                ref={markerRef}
                eventHandlers={{
                  click: e => {
                    setClickedPopup(place);
                    setOpenDrawer(true);
                  },
                }}
              ></Marker>
            ))}
          </>
        ) : null}
      </>
    );
  }
);
