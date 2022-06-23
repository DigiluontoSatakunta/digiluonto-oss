import React, { useEffect } from "react";
import { JourneyMarker } from "./JourneyMarker";
import { MapIcon } from "../icons/MapIcon";
import { useQuery } from "@apollo/client";
import { JOURNEYSBYLOCATION } from "../../../gql/queries/Map";

export const JourneyMarkers = ({
  setCompassPoi,
  activeJourney,
  setActivePlace,
  semiActiveJourney,
  setSemiActiveJourney,
  setJourneysWithingRadius,
  setActiveJourney,
  setOpenJourneyContent,
  refetchLocation,
  distance,
  group,
  locale,
  setClickedPopup,
  clickedPopup,
  markerRef,
  setOpenJourneyDrawer,
  openJourneyDrawer,
  map,
}) => {
  const { data, refetch } = useQuery(JOURNEYSBYLOCATION, {
    variables: {
      latitude: parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE),
      longitude: parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE),
      distance: 0,
      group: group?.id,
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
      if (refetchLocation)
        refetch({
          latitude: parseFloat(refetchLocation[0]),
          longitude: parseFloat(refetchLocation[1]),
          distance: distance || 0,
        });
      setJourneysWithingRadius(data?.journeysByLocation);
    }, 600);
    return () => clearInterval(fetchingTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchLocation, distance, refetch]);

  return !data?.journeysByLocation
    ? null
    : data?.journeysByLocation?.map(journey => {
        if (
          !journey.places.find(place => place.public === true) &&
          journey.ownerGroup.id !== group.id
        ) {
          return null;
        }
        if (activeJourney && activeJourney?.id === journey.id) {
          return (
            <JourneyMarker
              key={journey.id}
              journey={journey}
              setCompassPoi={setCompassPoi}
              activeJourney={activeJourney}
              setActivePlace={setActivePlace}
              setActiveJourney={setActiveJourney}
              setSemiActiveJourney={setSemiActiveJourney}
              setClickedPopup={setClickedPopup}
              setOpenJourneyContent={setOpenJourneyContent}
              clickedPopup={clickedPopup}
              markerRef={markerRef}
              setOpenJourneyDrawer={setOpenJourneyDrawer}
              openJourneyDrawer={openJourneyDrawer}
              map={map}
              icon={MapIcon("walker", "semiActiveJourney")}
            />
          );
        }
        if (activeJourney && activeJourney?.id !== journey.id) {
          return null;
        }

        if (semiActiveJourney && semiActiveJourney?.id === journey?.id) {
          return (
            <JourneyMarker
              key={journey.id}
              journey={journey}
              setCompassPoi={setCompassPoi}
              activeJourney={activeJourney}
              setActivePlace={setActivePlace}
              setActiveJourney={setActiveJourney}
              semiActiveJourney={semiActiveJourney}
              setSemiActiveJourney={setSemiActiveJourney}
              setOpenJourneyContent={setOpenJourneyContent}
              setClickedPopup={setClickedPopup}
              clickedPopup={clickedPopup}
              setOpenJourneyDrawer={setOpenJourneyDrawer}
              openJourneyDrawer={openJourneyDrawer}
              markerRef={markerRef}
              map={map}
              icon={MapIcon("walker", "semiActiveJourney")}
            />
          );
        } else {
          return (
            <JourneyMarker
              key={journey.id}
              journey={journey}
              setCompassPoi={setCompassPoi}
              activeJourney={activeJourney}
              setActivePlace={setActivePlace}
              semiActiveJourney={semiActiveJourney}
              setSemiActiveJourney={setSemiActiveJourney}
              setOpenJourneyContent={setOpenJourneyContent}
              setClickedPopup={setClickedPopup}
              setOpenJourneyDrawer={setOpenJourneyDrawer}
              openJourneyDrawer={openJourneyDrawer}
              clickedPopup={clickedPopup}
              markerRef={markerRef}
              map={map}
              icon={MapIcon("walker", "lowerSemiActiveJourney")}
            />
          );
        }
      });
};
