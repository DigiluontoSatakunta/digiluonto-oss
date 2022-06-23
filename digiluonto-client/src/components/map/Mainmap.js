import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { useTranslation } from "react-i18next";
import { getDistance } from "geolib";
import { isEqual } from "lodash";
import { Helmet } from "react-helmet";
import { useRouteMatch } from "react-router-dom";
import {
  MapContainer,
  LayerGroup,
  ScaleControl,
  TileLayer,
} from "react-leaflet";

import { makeStyles } from "@material-ui/core/styles";

import ping from "../../assets/ping.mp3";

import Compass from "./compass/Compass";
import { FavouritePopUp } from "../favourite/FavouritePopUp";
import { UserMarker } from "./markers/UserMarker";

import { PlacesList } from "./markers/PlacesList";
import { JourneyMarkers } from "./markers/JourneyMarkers";
import { ActiveJourney } from "./markers/ActiveJourney";
import { FirePlaces } from "./markers/FirePlaces";
import { GeoJsonRoute } from "./geojsonroutes/GeoJsonRoute";
import { ServicePlaces } from "./markers/ServicePlaces";
import { useGroup } from "../group/GroupContext";
import { useSettings } from "../settings/SettingsContext";

import { LocationDialog } from "../location/LocationDialog";
import { useLocation } from "../location/LocationContext";

import { FeedbackDrawer } from "../feedback/FeedbackDrawer";

import { isIOS } from "react-device-detect";
import { MapEvents } from "./MapEvents";

import deviceOrientation from "./deviceOrientation";
import { MarkerHelperFab } from "./fab/MarkerHelpFab";
import { DebugConsole } from "../../utils/DebugConsole";
import { PoiSnackbar } from "./snackbar/Snackbar";
import { CenterFab } from "./fab/CenterFab";
import { FavouriteFab } from "./fab/FavouriteFab";

import { Vessel } from "./pois/Vessel";

import { LayerFab } from "./fab/LayerFab";
import "leaflet/dist/leaflet.css";
import "./mapcss/Mainmap.css";
import { boolean } from "boolean";
import { UseLocalStorage } from "./UseLocalStorage";

import { RouteInfo } from "./markers/RouteInfo";
import MarkerClusterGroup from "react-leaflet-markercluster";

import "leaflet/dist/leaflet.css"; // sass
import "react-leaflet-markercluster/dist/styles.min.css"; // sass

import { PoriPlaces } from "./markers/PoriPlaces";
import { AccuracyDialog } from "./AccuracyDialog";
import { BadgeDrawer } from "./badge/BadgeDrawer";

import { DrawerPopup } from "./popup/DrawerPopup";
import { JourneyDrawerPopup } from "./popup/JourneyDrawerPopup";

import { SENDEVENT } from "../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { states } from "../../constants";
import { ServiceDrawerPopup } from "./popup/ServiceDrawerPopup";
import { crawlers } from "../../utils/crawlers";
require("leaflet/dist/leaflet.css"); // inside .js file
require("react-leaflet-markercluster/dist/styles.min.css");

const useStyles = makeStyles(() => ({
  map: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
  },
}));

const distanceSteps = [
  1500, 4000, 7000, 11000, 18000, 29000, 46000, 75000, 130000, 210000, 999999,
];

const defaultLocation = [
  process.env.REACT_APP_DEFAULT_LATITUDE,
  process.env.REACT_APP_DEFAULT_LONGITUDE,
];

export const MainMap = ({
  activePlace,
  setActivePlace,
  activeJourney,
  unCheckedTags,
  activeJourneyBounds,
  setActivePlaceBounds,
  activePlaceBounds,
  zoomJourneyOnce,
  setZoomJourneyOnce,
  setPlacesInLocation,
  placesInLocation,
  setUserIsInLocation,
  setActiveJourney,
  openJourneyContent,
  setOpenJourneyContent,
  setExpandPlace,
  userIsInLocation,
  expandPlace,
}) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { location } = useLocation();
  const { settings } = useSettings();

  const group = useGroup();
  const locale = i18n.language;

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const initialLocation = [
    parseFloat(
      location[0] || group?.latitude || process.env.REACT_APP_DEFAULT_LATITUDE
    ),
    parseFloat(
      location[1] || group?.longitude || process.env.REACT_APP_DEFAULT_LONGITUDE
    ),
  ];

  const [centerLocation, setCenterLocation] = useState(initialLocation);
  const [userLocation, setUserLocation] = useState(initialLocation);
  const [refetchLocation, setRefetchLocation] = useState(initialLocation);

  const [showBtn, setBtn] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [orientation, setOrientation] = useState();
  const [currentPlace, setCurrentPlace] = useState();
  const [compassPoi, setCompassPoi] = useState();
  const [nearbyAreaPlaces, setNearbyAreaPlaces] = useState([]);
  const [locationAccuracy, setLocationAccuracy] = useState();
  const markerRef = useRef({});
  const [map, setMap] = useState();
  const [zoomLevel, setZoomLevel] = useState(group?.zoom || 10);

  const [favouriteLocation, setFavouriteLocation] = useState(userLocation);
  const [loadMore, setLoadMore] = useState(Date.now());
  const [placesWithinRadius, setPlacesWithinRadius] = useState([]);
  const [journeysWithinRadius, setJourneysWithingRadius] = useState([]);
  const [setOpenMarkerHelper] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [badgeMessage, setBadgeMessage] = useState(false);
  const [reactedBadge, setReactedBadge] = useState([]);
  const [semiActiveJourney, setSemiActiveJourney] = useState(null);
  const [goForMultiple] = useState(false);
  const [entryRegion, setEntryRegion] = useState("");
  const storageRegion = localStorage.getItem("entryRegion");
  const uid = localStorage.getItem("uid");
  const [showDataSources, setShowDataSources] = useState({
    firePlaces: boolean(localStorage.getItem("firePlaces")) || false,
    servicePlaces: boolean(localStorage.getItem("servicePlaces")) || false,
    vessels: boolean(localStorage.getItem("vessels")) || false,
    poriNaturePlaces:
      boolean(localStorage.getItem("poriNaturePlaces")) || false,
  });

  const [geoJsonInfo, setGeoJsonInfo] = useState({
    position: [],
    highestAlt: null,
    lowestAlt: null,
    averageAlt: null,
  });

  const [showPlaces, setShowPlaces] = UseLocalStorage("showPlaces", true);
  const [showJourneys, setShowJourneys] = UseLocalStorage("showJourneys", true);
  const [showRoutes, setShowRoutes] = UseLocalStorage("showRoutes", true);

  // eslint-disable-next-line no-unused-vars
  const [fireplaceCounty, setFirePlaceCounty] = useState("Satakunta");
  const [loadedFirePlaceStates, setLoadedFirePlaceStates] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [clickedPopup, setClickedPopup] = useState(null);
  const [locationError, setLocaitonError] = useState();
  const [accuracyCheck, setAccuracyCheck] = useState();
  const [openAccuracyDialog, setOpenAccuracyDialog] = useState(false);
  const [accuracyPopup, setAccuracyPopup] = useState(
    boolean(localStorage.getItem("accuracyPopup"))
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openJourneyDrawer, setOpenJourneyDrawer] = useState(false);
  const { path } = useRouteMatch();
  let distance = useMemo(
    () => {
      if (!map) return;
      const bounds = map.getBounds().getSouthWest();
      const distance = getDistance(
        { latitude: refetchLocation[0], longitude: refetchLocation[1] },
        { latitude: bounds.lat, longitude: bounds.lng }
      );
      /*
        karkea etäisyystaulukko oikean etäisyyden muuttamiseksi
        välimuistiyhteensopivammaksi. Palautetaan oikeasta etäisyydestä
        seuraava karkea arvo. Karkeat arvot valittu Leafletin eri
        zoom arvoista ja hieman niitä kasvattaen.
      */

      /*
        Lähellä listauksen polkukorttikysely palauttaa kartan distancen mukaan dataa ilman
         if (path !== "/map") return distanceSteps.at(-1)
        DIG-995
      */
      if (path !== "/map") return distanceSteps.at(-1);
      return distanceSteps.find(step => step > distance);
    },
    // eslint-disable-next-line
    [map, refetchLocation, zoomLevel, path]
  );

  /* Takaisin keskelle, FAB käyttää */
  const backToCenter = useCallback(() => {
    if (followUser) setFollowUser(false);
    else {
      if (window.location.href.includes("/map")) {
        map.flyTo(userLocation, 16);
        setFollowUser(true);
      }
    }
  }, [map, userLocation, setFollowUser, followUser]);

  /* Audio ping kun ollaan POI:lla */
  const audio = useMemo(() => new Audio(ping), []);

  const playPing = useCallback(() => {
    if (settings.audio) audio.play();
  }, [audio, settings]);

  const playVibrate = useCallback(() => {
    if (settings.vibrate && "vibrate" in navigator) navigator.vibrate([400]);
  }, [settings]);

  const playNotifications = useCallback(() => {
    playPing();
    playVibrate();
  }, [playPing, playVibrate]);

  const handleEvent = useCallback((place, type) => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: type,
              data: "",
              place: place.id,
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCurrentPlace = useCallback(() => {
    // jos on aktiivinen niin resetoidaan kaikki
    if (currentPlace) {
      handleEvent(currentPlace, "departed");
      setBtn(false);
      //setSnackBar(false);
      setCurrentPlace(null);
      setPlacesInLocation(null);
      setUserIsInLocation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlace]);

  const activateCurrentPlace = useCallback(
    place => {
      setBtn(true);
      //setSnackBar(true);
      setClickedPopup(place);
      setOpenDrawer(true);
    },
    [setOpenDrawer]
  );
  const checkAreaOfRegion = useCallback(() => {
    if (userLocation)
      Object.entries(states).forEach(entry => {
        const [state, value] = entry;
        if (
          userLocation[0] > value[0] &&
          userLocation[0] < value[1] &&
          userLocation[1] > value[2] &&
          userLocation[1] < value[3]
        ) {
          setEntryRegion(state);
          localStorage.setItem("entryRegion", state);
          const userAgent = navigator.userAgent;
          if (!crawlers.includes(userAgent) && group && !settings?.debug) {
            sendEvent({
              variables: {
                input: {
                  data: {
                    type: "entryRegion",
                    data: `region: ${state}`,
                    group: group?.id,
                    uid: uid,
                  },
                },
              },
            });
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  useEffect(() => {
    if (userLocation && !storageRegion) {
      checkAreaOfRegion(userLocation, setEntryRegion, group, uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, entryRegion, storageRegion]);

  /* Päivitetään ja käytetään loadMore aikaleimaa, jotta ei ladata purskeissa. */
  useEffect(() => {
    const now = parseInt(Date.now());
    if (parseInt(Date.now()) - loadMore > 600) setLoadMore(now);
  }, [refetchLocation, distance, loadMore, setLoadMore]);

  /* Asetetaan noin arvo POI:den hakua varten, jotta ei haeta joka desimaalilla */
  useEffect(() => {
    if (
      centerLocation[0] &&
      (parseFloat(centerLocation[0]).toFixed(2) !== refetchLocation[0] ||
        parseFloat(centerLocation[1]).toFixed(2) !== refetchLocation[1])
    ) {
      setRefetchLocation([
        parseFloat(centerLocation[0]).toFixed(2),
        parseFloat(centerLocation[1]).toFixed(2),
      ]);
    }
  }, [
    showDataSources.firePlaces,
    centerLocation,
    refetchLocation,
    setRefetchLocation,
    map,
  ]);

  const setNearestPlacesInDistanceCheck = useCallback(() => {
    placesWithinRadius.forEach(place => {
      const distance = getDistance(
        { latitude: userLocation[0], longitude: userLocation[1] },
        {
          latitude: place.geoJSON.geometry.coordinates[1],
          longitude: place.geoJSON.geometry.coordinates[0],
        }
      );

      const placeIds = nearbyAreaPlaces.map(place => place.id);

      if (distance < 200 && !placeIds.includes(place.id)) {
        setNearbyAreaPlaces([...nearbyAreaPlaces, place]);
      }
    });
  }, [placesWithinRadius, nearbyAreaPlaces, setNearbyAreaPlaces, userLocation]);

  const userWithinPlaceRadius = useCallback(
    userLocation => {
      return nearbyAreaPlaces.filter(place => {
        return (
          place.geoJSON.properties.radius >
          getDistance(
            { latitude: userLocation[0], longitude: userLocation[1] },
            {
              latitude: place.geoJSON.geometry.coordinates[1],
              longitude: place.geoJSON.geometry.coordinates[0],
            }
          )
        );
      });
    },
    [nearbyAreaPlaces]
  );

  const closerThanCurrentPlace = useCallback(
    (place, userLocation) => {
      return (
        getDistance(
          { latitude: userLocation[0], longitude: userLocation[1] },
          {
            latitude: place.geoJSON.geometry.coordinates[1],
            longitude: place.geoJSON.geometry.coordinates[0],
          }
        ) <
        getDistance(
          { latitude: userLocation[0], longitude: userLocation[1] },
          {
            latitude: currentPlace?.geoJSON.geometry.coordinates[1] || 135.0, // pohjoisnapa
            longitude: currentPlace?.geoJSON.geometry.coordinates[0] || 90.0, // pohjoisnapa
          }
        )
      );
    },
    // eslint-disable-next-line
    [currentPlace]
  );

  const activateNewCurrentPlaces = useCallback(
    (place, places) => {
      if (places.length < 2) {
        setActivePlace(null);
        setCurrentPlace(place);
        setUserIsInLocation(place);
        handleEvent(place, "arrived");
      }
      if (places.length >= 2) {
        setActivePlace(null);
        setCurrentPlace(place);
        setPlacesInLocation(places);
      }

      if (!showBtn) {
        playNotifications();
        activateCurrentPlace(place);
      }
    },
    [
      showBtn,
      setCurrentPlace,
      playNotifications,
      activateCurrentPlace,
      setUserIsInLocation,
      setPlacesInLocation,
      setActivePlace,
      handleEvent,
    ]
  );

  const doSomethingWhenUserIsWithinPlace = useCallback(
    (places, userLocation) => {
      places.forEach(place => {
        // jos ei aktiivista polkua ja paikan tagia ei ole piilotettu kartalta
        // tai jos aktiivinen polku ja se on sama kuin mikä löytyy paikasta
        // ja paikka on eri kuin currentPlace ja lähempänä
        // silloin asetetaan uudeksi currentPlaceksi

        if (
          (!activeJourney && !unCheckedTags.includes(place?.tags[0]?.id)) ||
          activeJourney
        ) {
          const isCloser = closerThanCurrentPlace(place, userLocation);

          if (place.id !== currentPlace?.id && isCloser && !goForMultiple) {
            activateNewCurrentPlaces(place, places);
          }
        }
        return null;
      });
    },

    [
      //activateNewCurrentJourney,
      goForMultiple,
      currentPlace,
      activeJourney,
      unCheckedTags,
      activateNewCurrentPlaces,
      closerThanCurrentPlace,
    ]
  );

  const zoomJourney = useCallback(() => {
    if (map && activeJourneyBounds.includes(userLocation))
      map.fitBounds(activeJourneyBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, activeJourneyBounds]);

  const zoomActivePlace = useCallback(() => {
    if (map && activePlaceBounds.includes(userLocation))
      map.fitBounds(activePlaceBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, activePlaceBounds]);

  useEffect(() => {
    if (activeJourney && !zoomJourneyOnce) {
      activeJourneyBounds.push(userLocation);
      setFollowUser(false);
      zoomJourney();
      setZoomJourneyOnce(true);
    }
    if (activePlace && !activeJourney) {
      if (!activePlaceBounds.includes(userLocation)) {
        setActivePlaceBounds([...activePlaceBounds, userLocation]);
      }
      setFollowUser(false);
      zoomActivePlace();
    }
    if (activePlace && activeJourney) {
      if (!activePlaceBounds.includes(userLocation)) {
        setActivePlaceBounds([...activePlaceBounds, userLocation]);
      }
      setFollowUser(false);
      zoomActivePlace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomJourney, activeJourneyBounds, activePlace, zoomActivePlace]);

  useEffect(() => {
    if (
      !isEqual(userLocation, defaultLocation) &&
      followUser &&
      userLocation &&
      map &&
      window.location.href.includes("/map")
    ) {
      map.flyTo(userLocation, 16);
    }
    if (userLocation) deviceOrientation(userLocation, setOrientation);
  }, [userLocation, followUser, map, clickedPopup]);

  const userWithinJourneyRadius = useCallback(
    userLocation => {
      return journeysWithinRadius.filter(journey => {
        return (
          journey.radius >
          getDistance(
            { latitude: userLocation[0], longitude: userLocation[1] },
            {
              latitude: journey.geoJSON.geometry.coordinates[1],
              longitude: journey.geoJSON.geometry.coordinates[0],
            }
          )
        );
      });
    },
    [journeysWithinRadius]
  );

  const listJourneyToOpen = useCallback(
    journeys => {
      journeys?.forEach(journey => {
        if (
          (journey?.id === activeJourney?.id ||
            journey?.id === semiActiveJourney?.id) &&
          journey.showPlacesInJourneysArea
        ) {
          setOpenJourneyContent(journey);
        }
      });
    },
    [activeJourney, semiActiveJourney, setOpenJourneyContent]
  );

  useEffect(() => {
    if (placesWithinRadius) setNearestPlacesInDistanceCheck();
    const places = userWithinPlaceRadius(userLocation);

    // käyttäjä on paikan/paikkojen alueella
    if (places.length) {
      doSomethingWhenUserIsWithinPlace(places, userLocation);
    } else resetCurrentPlace(); // ei ole yhdenkään alueella
  }, [
    placesWithinRadius,
    goForMultiple,
    userLocation,
    activeJourney,
    userWithinPlaceRadius,
    doSomethingWhenUserIsWithinPlace,
    playNotifications,
    resetCurrentPlace,
    setNearestPlacesInDistanceCheck,
  ]);

  useEffect(() => {
    let journeys;
    if (journeysWithinRadius && (activeJourney || semiActiveJourney))
      journeys = userWithinJourneyRadius(userLocation);

    if (
      journeys?.length &&
      (semiActiveJourney || activeJourney) &&
      !openJourneyContent?.length
    ) {
      listJourneyToOpen(journeys);
    }

    if (!activeJourney && !semiActiveJourney) {
      setOpenJourneyContent(null);
    }
  }, [
    openJourneyContent,
    activeJourney,
    semiActiveJourney,
    journeysWithinRadius,
    userLocation,
    userWithinJourneyRadius,
    listJourneyToOpen,
    setOpenJourneyContent,
  ]);

  useEffect(() => {
    const lastDetectedPosition = [
      parseFloat(
        localStorage.getItem("lastLatitude") ||
          process.env.REACT_APP_DEFAULT_LATITUDE
      ),
      parseFloat(
        localStorage.getItem("lastLongitude") ||
          process.env.REACT_APP_DEFAULT_LONGITUDE
      ),
    ];
    if (lastDetectedPosition !== parseFloat(location))
      setUserLocation(lastDetectedPosition);
    return () => {
      if (
        userLocation[0] !==
          parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE) &&
        userLocation[1] !== parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE)
      ) {
        localStorage.setItem("lastLatitude", userLocation[0]);
        localStorage.setItem("lastLongitude", userLocation[1]);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLoactionWarp = useCallback(() => {
    setAccuracyCheck(userLocation);
    if (accuracyCheck)
      return getDistance(
        { latitude: userLocation[0], longitude: userLocation[1] },
        {
          latitude: accuracyCheck[0],
          longitude: accuracyCheck[1],
        }
      );
  }, [accuracyCheck, userLocation]);

  useEffect(() => {
    const checkAccuracy = setInterval(() => {
      const distanceBetweenLastLocation = checkLoactionWarp();
      if (
        distanceBetweenLastLocation > 50 &&
        locationAccuracy > 40 &&
        !settings.debug &&
        !accuracyPopup
      ) {
        setOpenAccuracyDialog({ open: true, checked: false });
      }
    }, 5000);
    if (accuracyPopup) {
      clearInterval(checkAccuracy);
    }
    return () => clearInterval(checkAccuracy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkLoactionWarp, locationAccuracy, accuracyPopup]);

  return (
    <div className={classes.map}>
      <Helmet>
        <title>
          {t("Map")} | {group?.name}
        </title>
        <meta name="description" content={group?.welcome} />
      </Helmet>
      {snackBar && (
        <PoiSnackbar
          key="poisnackbar"
          currentPlace={currentPlace}
          setSnackBar={setSnackBar}
          placesInLocation={placesInLocation}
        />
      )}
      <LocationDialog
        requestLocation={false}
        map={map}
        locationError={locationError}
      />
      <FeedbackDrawer
        style={{ width: "100%", height: 100, backgroundColor: "red" }}
        setOpenDrawer={setOpenDrawer}
        setOpenJourneyDrawer={setOpenJourneyDrawer}
      />

      {openAccuracyDialog && (
        <AccuracyDialog
          locationAccuracy={locationAccuracy}
          setOpenAccuracyDialog={setOpenAccuracyDialog}
          setAccuracyPopup={setAccuracyPopup}
        />
      )}
      <MapContainer
        whenCreated={map => {
          setMap(map);
        }}
        zoomSnap={0.7}
        center={location}
        zoom={10}
        maxZoom={18}
        minZoom={6}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        className="markercluster-map"
      >
        <ScaleControl position="bottomleft" imperial={false} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents
          setFavouriteLocation={setFavouriteLocation}
          setUserLocation={setUserLocation}
          setCenterLocation={setCenterLocation}
          setZoomLevel={setZoomLevel}
          activeJourney={activeJourney}
          setFollowUser={setFollowUser}
          setGeoJsonInfo={setGeoJsonInfo}
          geoJsonInfo={geoJsonInfo}
          setLocationAccuracy={setLocationAccuracy}
          setClickedPopup={setClickedPopup}
          followUser={followUser}
          setLocaitonError={setLocaitonError}
          clickedPopup={clickedPopup}
          setOpenDrawer={setOpenDrawer}
          setOpenJourneyDrawer={setOpenJourneyDrawer}
          openDrawer={openDrawer}
          setExpandPlace={setExpandPlace}
          map={map}
        >
          <>
            {showPlaces && distance > 0 && (
              <LayerGroup>
                <PlacesList
                  key="place-markers"
                  currentPlace={currentPlace}
                  unCheckedTags={unCheckedTags}
                  activePlace={activePlace}
                  showBtn={showBtn}
                  setCompassPoi={setCompassPoi}
                  distance={distance}
                  centerLocation={centerLocation}
                  setPlacesWithinRadius={setPlacesWithinRadius}
                  setActivePlace={setActivePlace}
                  activeJourney={activeJourney}
                  userLocation={userLocation}
                  markerRef={markerRef}
                  semiActiveJourney={semiActiveJourney}
                  placesInLocation={placesInLocation}
                  setActivePlaceBounds={setActivePlaceBounds}
                  showPlaces={showPlaces}
                  visitedPlaces={visitedPlaces}
                  setVisitedPlaces={setVisitedPlaces}
                  refetchLocation={refetchLocation}
                  group={group}
                  locale={locale}
                  setClickedPopup={setClickedPopup}
                  clickedPopup={clickedPopup}
                  openJourneyContent={openJourneyContent}
                  setOpenDrawer={setOpenDrawer}
                  setExpandPlace={setExpandPlace}
                  openDrawer={openDrawer}
                  map={map}
                />
              </LayerGroup>
            )}
            {showJourneys && distance > 0 && (
              <LayerGroup>
                <JourneyMarkers
                  key="journey-markers"
                  refetchLocation={refetchLocation}
                  distance={distance}
                  group={group}
                  markerRef={markerRef}
                  locale={locale}
                  setActivePlace={setActivePlace}
                  setCompassPoi={setCompassPoi}
                  activeJourney={activeJourney}
                  setActiveJourney={setActiveJourney}
                  semiActiveJourney={semiActiveJourney}
                  setSemiActiveJourney={setSemiActiveJourney}
                  setClickedPopup={setClickedPopup}
                  clickedPopup={clickedPopup}
                  visitedPlaces={visitedPlaces}
                  setVisitedPlaces={setVisitedPlaces}
                  setOpenJourneyDrawer={setOpenJourneyDrawer}
                  openJourneyDrawer={openJourneyDrawer}
                  setJourneysWithingRadius={setJourneysWithingRadius}
                  setOpenJourneyContent={setOpenJourneyContent}
                  map={map}
                />
              </LayerGroup>
            )}
            {(activeJourney || semiActiveJourney) && (
              <LayerGroup>
                <ActiveJourney
                  key="active-journey"
                  activeJourney={activeJourney}
                  showBtn={showBtn}
                  markerRef={markerRef}
                  setCompassPoi={setCompassPoi}
                  setActivePlace={setActivePlace}
                  semiActiveJourney={semiActiveJourney}
                  setActivePlaceBounds={setActivePlaceBounds}
                  visitedPlaces={visitedPlaces}
                  setVisitedPlaces={setVisitedPlaces}
                  setReactedBadge={setReactedBadge}
                  setBadgeMessage={setBadgeMessage}
                  badgeMessage={badgeMessage}
                  reactedBadge={reactedBadge}
                  setOpenDrawer={setOpenDrawer}
                  map={map}
                  currentPlace={currentPlace}
                  setClickedPopup={setClickedPopup}
                  clickedPopup={clickedPopup}
                  group={group}
                />
              </LayerGroup>
            )}
            {showDataSources.firePlaces && (
              <MarkerClusterGroup>
                <FirePlaces
                  key="fireplace-markers"
                  map={map}
                  markerRef={markerRef}
                  centerLocation={centerLocation}
                  setFirePlaceCounty={setFirePlaceCounty}
                  loadedFirePlaceStates={loadedFirePlaceStates}
                  setLoadedFirePlaceStates={setLoadedFirePlaceStates}
                />
              </MarkerClusterGroup>
            )}
            {showDataSources.servicePlaces && distance > 0 && (
              <LayerGroup>
                <ServicePlaces
                  key="serviceplace-markers"
                  markerRef={markerRef}
                  locale={locale}
                  setClickedPopup={setClickedPopup}
                  refetchLocation={refetchLocation}
                  distance={distance}
                  setOpenDrawer={setOpenDrawer}
                />
              </LayerGroup>
            )}
            {showDataSources.poriNaturePlaces && (
              <LayerGroup>
                <PoriPlaces
                  key="serviceplace-markers"
                  markerRef={markerRef}
                  locale={locale}
                  refetchLocation={refetchLocation}
                  distance={distance}
                />
              </LayerGroup>
            )}
            {group?.dataSources?.find(
              source => source?.slug === "digitraffic-marine"
            ) &&
              showDataSources?.vessels && (
                <LayerGroup>
                  {group?.vessels?.map(vessel => (
                    <Vessel
                      vessel={vessel}
                      key={vessel.id}
                      markerRef={markerRef}
                      refetchLocation={refetchLocation}
                    />
                  ))}
                </LayerGroup>
              )}
            {showRoutes && (
              <GeoJsonRoute
                key="geojson-route"
                activeJourney={activeJourney}
                semiActiveJourney={semiActiveJourney}
                setGeoJsonInfo={setGeoJsonInfo}
                distance={distance}
                refetchLocation={refetchLocation}
                group={group}
                locale={locale}
              />
            )}
            <LayerGroup>
              {userLocation &&
                userLocation[0] !==
                  parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE) &&
                userLocation[1] !==
                  parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE) && (
                  <UserMarker position={userLocation} />
                )}
            </LayerGroup>
            {geoJsonInfo.position.length ? (
              <RouteInfo geoJsonInfo={geoJsonInfo} />
            ) : null}
            <LayerGroup>
              {settings.favMode && favouriteLocation && (
                <FavouritePopUp favouriteLocation={favouriteLocation} />
              )}
            </LayerGroup>
          </>
        </MapEvents>
      </MapContainer>
      {clickedPopup?.__typename === "Place" ? (
        <DrawerPopup
          open={openDrawer}
          setOpenDrawer={setOpenDrawer}
          setExpandPlace={setExpandPlace}
          place={clickedPopup}
          visitedPlaces={visitedPlaces}
          openJourneyContent={openJourneyContent}
          placesInLocation={placesInLocation}
          unCheckedTags={unCheckedTags}
          setActivePlace={setActivePlace}
          userIsInLocation={userIsInLocation}
          activeJourney={activeJourney}
        ></DrawerPopup>
      ) : null}
      {clickedPopup?.__typename === "Journey" ? (
        <JourneyDrawerPopup
          open={openJourneyDrawer}
          journey={clickedPopup}
          setExpandPlace={setExpandPlace}
          semiActiveJourney={semiActiveJourney}
          activeJourney={activeJourney}
          setActiveJourney={setActiveJourney}
          setSemiActiveJourney={setSemiActiveJourney}
          setOpenJourneyContent={setOpenJourneyContent}
          setOpenDrawer={setOpenDrawer}
        ></JourneyDrawerPopup>
      ) : null}
      {clickedPopup?.__typename === "Service" ? (
        <ServiceDrawerPopup
          open={openDrawer}
          place={clickedPopup}
          setExpandPlace={setExpandPlace}
          semiActiveJourney={semiActiveJourney}
          activeJourney={activeJourney}
          setActiveJourney={setActiveJourney}
          setSemiActiveJourney={setSemiActiveJourney}
          setOpenJourneyContent={setOpenJourneyContent}
          setOpenDrawer={setOpenDrawer}
        ></ServiceDrawerPopup>
      ) : null}
      <LayerFab
        map={map}
        showDataSources={showDataSources}
        setShowDataSources={setShowDataSources}
        group={group}
        setShowPlaces={setShowPlaces}
        setShowJourneys={setShowJourneys}
        setShowRoutes={setShowRoutes}
        showPlaces={showPlaces}
        showJourneys={showJourneys}
        showRoutes={showRoutes}
        centerLocation={centerLocation}
        zoomLevel={zoomLevel}
        setLoadedFirePlaceStates={setLoadedFirePlaceStates}
      />

      <MarkerHelperFab
        setOpenMarkerHelper={setOpenMarkerHelper}
        setOpenDrawer={setOpenDrawer}
        setOpenJourneyDrawer={setOpenJourneyDrawer}
      />
      <BadgeDrawer
        setReactedBadge={setReactedBadge}
        setBadgeMessage={setBadgeMessage}
        badgeMessage={badgeMessage}
        reactedBadge={reactedBadge}
        activeJourney={activeJourney}
        setOpenJourneyDrawer={setOpenJourneyDrawer}
        setOpenDrawer={setOpenDrawer}
      />
      <CenterFab backToCenter={backToCenter} followUser={followUser} />
      {group?.name === "Digiluonto" && <FavouriteFab />}
      {settings.debug && (
        <DebugConsole
          location={userLocation}
          locationAccuracy={locationAccuracy}
        />
      )}
      {!process.env.REACT_APP_SERVER.startsWith("production") && ( //DIG-999 use startsWith instead of ===, allows additional specifiers on this environment
        <p
          style={{
            position: "absolute",
            top: -16,
            left: 3,
            zIndex: 2000,
          }}
        >
          accuracy:{" "}
          {locationAccuracy ? Math.round(locationAccuracy) : "ei sijaintia"}
        </p>
      )}
      {compassPoi && !isIOS && (
        <Compass
          key="compass"
          location={userLocation}
          setPoi={setCompassPoi}
          poi={compassPoi}
          orientation={orientation}
        />
      )}
      {/* {showBtn && !placesInLocation && (
        <CurrentPoiFab currentPlace={currentPlace} />
      )} */}

      {/* {openMarkerHelper && (
        <MarkerHelperContent
          openMarkerHelper={openMarkerHelper}
          setOpenMarkerHelper={setOpenMarkerHelper}
        />
      )} */}
    </div>
  );
};
