import React, { memo, useEffect } from "react";
import { isPointWithinRadius } from "geolib";
import { PointerIcon } from "../icons/PointerIcon";
import { CustomMarker } from "./CustomMarker";
import { MapIcon } from "../icons/MapIcon";
import { useQuery } from "@apollo/client";
import { PLACESONMAP } from "../../../gql/queries/PlacesOnMap";
import { BlankIconCurrent } from "../icons/MapIcon";

export const PlaceMarkers = memo(
  ({
    currentPlace,
    activePlace,
    setActivePlace,
    showBtn,
    setCompassPoi,
    unCheckedTags,
    distance,
    centerLocation,
    setPlacesWithinRadius,
    activeJourney,
    placesInLocation,
    markerRef,
    semiActiveJourney,
    setActivePlaceBounds,
    visitedPlaces,
    setVisitedPlaces,
    refetchLocation,
    group,
    locale,
    clickedPopup,
    setClickedPopup,
    openJourneyContent,
    setOpenDrawer,
    setExpandPlace,
    openDrawer,
    map,
  }) => {
    const { data, refetch } = useQuery(PLACESONMAP, {
      variables: {
        latitude: parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE),
        longitude: parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE),
        distance: 0,
        group: group?.id,
        locale,
      },
      fetchPolicy: "cache-first",
    });

    const visited = localStorage.getItem("visitedPlaces" || []);

    const placesWithinRadius = data?.placesOnMap?.filter(place =>
      isPointWithinRadius(
        {
          latitude: place.geoJSON.geometry.coordinates[1],
          longitude: place.geoJSON.geometry.coordinates[0],
        },
        { latitude: centerLocation[0], longitude: centerLocation[1] },
        distance
      )
    );
    useEffect(() => {
      if (refetchLocation)
        refetch({
          latitude: parseFloat(refetchLocation[0]),
          longitude: parseFloat(refetchLocation[1]),
          distance: distance || 0,
        });
      setPlacesWithinRadius(placesWithinRadius);
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

        setPlacesWithinRadius(placesWithinRadius);
      }, 600);
      return () => clearInterval(fetchingTimeout);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchLocation, distance, refetch, setPlacesWithinRadius]);

    // /* asetaan paikat jotka näkyvissä kartalla näitä tarkastellaan
    //    suhteessa osumiseen käyttäjän kanssa. */
    useEffect(() => {
      setVisitedPlaces(visited);
    }, [activeJourney, visitedPlaces, setVisitedPlaces, visited]);

    return !placesWithinRadius
      ? null
      : placesWithinRadius?.map(place => (
          <PlaceMarker
            key={`key-${place.id}`}
            place={place}
            currentPlace={currentPlace}
            activePlace={activePlace}
            setActivePlace={setActivePlace}
            setCompassPoi={setCompassPoi}
            showBtn={showBtn}
            unCheckedTags={unCheckedTags}
            activeJourney={activeJourney}
            markerRef={markerRef}
            semiActiveJourney={semiActiveJourney}
            placesInLocation={placesInLocation}
            setActivePlaceBounds={setActivePlaceBounds}
            visitedPlaces={visitedPlaces}
            placesWithinRadius={placesWithinRadius}
            clickedPopup={clickedPopup}
            setClickedPopup={setClickedPopup}
            openJourneyContent={openJourneyContent}
            setOpenDrawer={setOpenDrawer}
            openDrawer={openDrawer}
            setExpandPlace={setExpandPlace}
            map={map}
          />
        ));
  }
);

const PlaceMarker = ({
  place,
  currentPlace,
  activePlace,
  setCompassPoi,
  setActivePlace,
  showBtn,
  unCheckedTags,
  markerRef,
  placesInLocation,
  setActivePlaceBounds,
  visitedPlaces,
  clickedPopup,
  setClickedPopup,
  activeJourney,
  semiActiveJourney,
  openJourneyContent,
  setOpenDrawer,
  setExpandPlace,
  openDrawer,
  map,
}) => {
  if (activePlace?.id === place.id) {
    return (
      <CustomMarker
        key={place.id}
        place={place}
        icon={PointerIcon}
        markerRef={markerRef}
        setActivePlace={setActivePlace}
        setCompassPoi={setCompassPoi}
        setActivePlaceBounds={setActivePlaceBounds}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        openJourneyContent={openJourneyContent}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        openDrawer={openDrawer}
        setExpandPlace={setExpandPlace}
        map={map}
      />
    );
  }
  if (
    clickedPopup?.id === place?.id &&
    openDrawer &&
    !activeJourney &&
    !semiActiveJourney
  ) {
    return (
      <CustomMarker
        key={place.id}
        place={place}
        icon={MapIcon(place?.icon, "currentIcon")}
        markerRef={markerRef}
        setActivePlace={setActivePlace}
        setCompassPoi={setCompassPoi}
        setActivePlaceBounds={setActivePlaceBounds}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        openJourneyContent={openJourneyContent}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        setExpandPlace={setExpandPlace}
        map={map}
      />
    );
  }
  if (
    visitedPlaces &&
    visitedPlaces.includes(place?.id) &&
    currentPlace?.id === place.id &&
    !placesInLocation
  ) {
    return (
      <CustomMarker
        key={place.id}
        place={place}
        icon={MapIcon("check", "currentIcon")}
        setActivePlace={setActivePlace}
        showBtn={showBtn}
        setCompassPoi={setCompassPoi}
        markerRef={markerRef}
        setActivePlaceBounds={setActivePlaceBounds}
        visitedPlaces={visitedPlaces}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        openJourneyContent={openJourneyContent}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        setExpandPlace={setExpandPlace}
        map={map}
      />
    );
  }
  if (currentPlace?.id === place.id && !placesInLocation) {
    return (
      <CustomMarker
        key={place.id}
        place={place}
        icon={
          semiActiveJourney || activeJourney
            ? BlankIconCurrent("currentIcon")
            : MapIcon(place.icon, "currentIcon")
        }
        setActivePlace={setActivePlace}
        showBtn={showBtn}
        markerRef={markerRef}
        setCompassPoi={setCompassPoi}
        setActivePlaceBounds={setActivePlaceBounds}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        openJourneyContent={openJourneyContent}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        setExpandPlace={setExpandPlace}
        currentPlace={currentPlace}
        map={map}
      />
    );
  }

  if (visitedPlaces && visitedPlaces.includes(place?.id)) {
    return (
      <CustomMarker
        key={place.id}
        place={place}
        icon={MapIcon("check", "blueIcon")}
        setActivePlace={setActivePlace}
        showBtn={showBtn}
        markerRef={markerRef}
        setCompassPoi={setCompassPoi}
        setActivePlaceBounds={setActivePlaceBounds}
        openJourneyContent={openJourneyContent}
        visitedPlaces={visitedPlaces}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        setExpandPlace={setExpandPlace}
        map={map}
      />
    );
  } else if (place?.tags[0] && unCheckedTags.includes(place?.tags[0].id)) {
    return null;
  } else {
    return (
      <CustomMarker
        autoPan={false}
        key={place.id}
        icon={
          activeJourney
            ? MapIcon(place?.icon, "colorBlind")
            : MapIcon(place?.icon, "blueIcon")
        }
        place={place}
        markerRef={markerRef}
        setActivePlace={setActivePlace}
        setCompassPoi={setCompassPoi}
        setActivePlaceBounds={setActivePlaceBounds}
        openJourneyContent={openJourneyContent}
        clickedPopup={clickedPopup}
        setClickedPopup={setClickedPopup}
        activeJourney={activeJourney}
        semiActiveJourney={semiActiveJourney}
        setOpenDrawer={setOpenDrawer}
        setExpandPlace={setExpandPlace}
        map={map}
      />
    );
  }
};
