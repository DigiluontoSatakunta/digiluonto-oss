import React from "react";
import { CustomMarker } from "./CustomMarker";
import { BlankIconSemi, MapIcon } from "../icons/MapIcon";

export const ActiveJourney = ({
  showBtn,
  setCompassPoi,
  setActivePlace,
  semiActiveJourney,
  setActivePlaceBounds,
  activeJourney,
  visitedPlaces,
  setOpenDrawer,
  currentPlace,
  setClickedPopup,
  group,
  map,
}) => {
  const journey = activeJourney || semiActiveJourney;
  const places = [...journey.places];

  const sortedPlaces = places?.sort((a, b) => a?.order - b?.order);

  const orderByJourney = places?.sort(
    (a, b) => journey?.order?.indexOf(a.id) - journey?.order?.indexOf(b.id)
  );

  return (
    <>
      {orderByJourney?.length !== 0
        ? orderByJourney?.map(place => (
            <CustomMarker
              key={place.id}
              place={place}
              icon={
                visitedPlaces?.includes(place?.id) && semiActiveJourney
                  ? MapIcon("check", "semiActiveJourney")
                  : visitedPlaces?.includes(place?.id) && activeJourney
                  ? MapIcon("check", "semiActiveJourney")
                  : group.name === "Satakunnan Viikko"
                  ? MapIcon(place.icon, "semiActiveJourney")
                  : semiActiveJourney
                  ? BlankIconSemi("semiActiveJourney")
                  : BlankIconSemi("semiActiveJourney")
              }
              setActivePlace={setActivePlace}
              showBtn={showBtn}
              setCompassPoi={setCompassPoi}
              setActivePlaceBounds={setActivePlaceBounds}
              tooltip={group.name === "Satakunnan Viikko" ? false : true}
              visitedPlaces={visitedPlaces}
              setClickedPopup={setClickedPopup}
              semiActiveJourney={semiActiveJourney}
              activeJourney={activeJourney}
              setOpenDrawer={setOpenDrawer}
              currentPlace={currentPlace}
              map={map}
            />
          ))
        : sortedPlaces?.map(place => (
            <CustomMarker
              key={place.id}
              place={place}
              icon={
                visitedPlaces?.includes(place?.id) && semiActiveJourney
                  ? MapIcon("check", "semiActiveJourney")
                  : visitedPlaces?.includes(place?.id) && activeJourney
                  ? MapIcon("check", "semiActiveJourney")
                  : group.name === "Satakunnan Viikko"
                  ? MapIcon(place.icon, "semiActiveJourney")
                  : semiActiveJourney
                  ? BlankIconSemi("semiActiveJourney")
                  : BlankIconSemi("semiActiveJourney")
              }
              setActivePlace={setActivePlace}
              showBtn={showBtn}
              setCompassPoi={setCompassPoi}
              setActivePlaceBounds={setActivePlaceBounds}
              tooltip={group.name === "Satakunnan Viikko" ? false : true}
              visitedPlaces={visitedPlaces}
              setClickedPopup={setClickedPopup}
              semiActiveJourney={semiActiveJourney}
              activeJourney={activeJourney}
              setOpenDrawer={setOpenDrawer}
              currentPlace={currentPlace}
              map={map}
            />
          ))}
    </>
  );
};
