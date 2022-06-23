import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { VesselMarker } from "../markers/VesselMarker";
import { VESSEL_LOCATION } from "../../../gql/queries/Vessel";

export const Vessel = ({ vessel, markerRef }) => {
  const { data, refetch } = useQuery(VESSEL_LOCATION, {
    variables: {
      mmsi: parseInt(vessel?.mmsi),
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(parseInt(vessel.mmsi));
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [refetch, vessel]);

  return (
    <>
      {data ? (
        <VesselMarker
          key={vessel.id}
          vessel={vessel}
          data={data || []}
          markerRef={markerRef}
        />
      ) : null}
    </>
  );
};
