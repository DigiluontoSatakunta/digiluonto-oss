import React, { useState, useEffect, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { isSafari } from "react-device-detect";
import { isIOS, isChrome, isFirefox } from "react-device-detect";
import { useLocation } from "./LocationContext";
import { useGroup } from "../group/GroupContext";

import useNavigatorPermissions from "./useNavigatorPermissions";
import IosHelpModal from "./IosHelpModal";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { SENDEVENT } from "../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { crawlers } from "../../utils/crawlers";
import { useSettings } from "../settings/SettingsContext";

export const LocationDialog = ({
  requestLocation = true,
  map = null,
  locationError,
}) => {
  const { t } = useTranslation();
  const group = useGroup();
  const uid = localStorage.getItem("uid");
  const [open, setOpen] = useState(false);
  const { updateLocation } = useLocation();
  const { status, error } = useNavigatorPermissions("geolocation");
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const settings = useSettings();
  const isDeniedUntil = parseInt(
    localStorage.getItem("geolocationPermissionDenied") || 0
  );

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const handleAccept = () => {
    setOpen(false);
    getMyCurrentPosition();
  };

  const handleDisagree = () => {
    setOpen(false);
    // 43200000 milliseconds = 12 hours == 12 * 60 * 60 * 1000
    const willBeDeniedUntil = Date.now() + 43200000;
    localStorage.setItem("geolocationPermissionDenied", willBeDeniedUntil);
  };

  const handleEvent = useCallback(isGpsAllowed => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "isGpsAllowed",
              data: "",
              group: group?.id,
              local: isGpsAllowed,
              uid: uid,
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMyCurrentPosition = useCallback(() => {
    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
      maximumAge: 0,
    };

    const handleSuccess = pos => {
      const { latitude, longitude } = pos.coords;
      localStorage.setItem("isGpsAllowed", true);
      handleEvent(true);
      updateLocation([
        Number.parseFloat(latitude).toFixed(3),
        Number.parseFloat(longitude).toFixed(3),
      ]);
    };

    const handleError = error => {
      if (error.code === error.PERMISSION_DENIED) {
        localStorage.setItem("isGpsAllowed", false);
        handleEvent(false);
        updateLocation([
          Number.parseFloat(group?.latitude).toFixed(3),
          Number.parseFloat(group?.longitude).toFixed(3),
        ]);
      }
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      locationOptions
    );
  }, [updateLocation, group, handleEvent]);

  // const handleEvent = useCallback(boolean => {
  //   console.log(boolean);
  //   sendEvent({
  //     variables: {
  //       input: {
  //         data: {
  //           type: "isGpsAllowed",
  //           local: boolean,
  //           uid: uid,
  //         },
  //       },
  //     },
  //   });
  // }, []);

  useEffect(() => {
    if (status === "granted") {
      setOpen(false);
      if (requestLocation) getMyCurrentPosition();
      if (map && !locationError)
        map.locate({ watch: true, enableHighAccuracy: true });
    } else if (status === "denied") {
      localStorage.setItem("isGpsAllowed", false);
      handleEvent(false);
      // handleEvent(false);
      //User is not interested in geolocation, we will not pester them anymore
      //TODO?: However, we might want to inform them just one time that:
      //       "Hey, just letting you know that you seem to have been blocked geolocation"
    } else if (status === "") {
    } else {
      if (Date.now() > isDeniedUntil) {
        setTimeout(() => {
          setOpen(true);
        }, 200);
      }
    }
  }, [
    status,
    error,
    getMyCurrentPosition,
    setOpen,
    requestLocation,
    map,
    locationError,
    isDeniedUntil,
    handleEvent,
  ]);

  // koska safari ei osaa vielä permissions apia niin käytetään vain perintäistä
  // tapaa. Kun tuki tulee niin poistetaan tämä ja toimii kuten muut.
  useEffect(() => {
    if (isSafari || isFirefox) {
      if (requestLocation) {
        getMyCurrentPosition();
      }
      if (map && !locationError)
        map.locate({ watch: true, enableHighAccuracy: true });
      else {
        localStorage.setItem("isGpsAllowed", false);
        handleEvent(false);
      }
    }
    if (isIOS && isChrome) {
      if (requestLocation) getMyCurrentPosition();
      if (map && !locationError)
        map.locate({ watch: true, enableHighAccuracy: true });
      else {
        localStorage.setItem("isGpsAllowed", false);
        handleEvent(false);
      }
    }
    if (locationError === "locationerror" && map) {
      map.locate({ watch: true, enableHighAccuracy: true });
    }
  }, [requestLocation, map, getMyCurrentPosition, locationError, handleEvent]);

  return (
    <>
      {isIOS && (
        <IosHelpModal
          openHelpModal={openHelpModal}
          setOpenHelpModal={setOpenHelpModal}
        />
      )}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-cy="dialog-alert"
        style={{ zIndex: 1900 }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            paddingTop: 24,
            paddingBottom: 0,
            marginBottom: -8,
          }}
        >
          {t("Use location service?")}
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-description" style={{ lineHeight: 1.5 }}>
            <p>
              {t(
                "Digiluonto application needs location service to work properly. To complete journeys and open locked places location is required. We don't use your location to any other purposes than this application and your location won't be shared to 3rd parties."
              )}
            </p>
            <ul style={{ paddingLeft: "24px" }}>
              <li>
                <Trans i18nKey="Tap Agree if you want to allow use of Location Service.">
                  Tap Agree if you want to allow use of Location Service.
                </Trans>
              </li>
              <li>
                <Trans i18nKey="Tap Disagree if you dont want to allow use of Location Service.">
                  Tap Disagre if you don't want to allow use of Location
                  Service.
                </Trans>
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDisagree}
            color="primary"
            data-cy="btn-loc-disagree"
          >
            {t("Disagree")}
          </Button>
          <Button
            onClick={handleAccept}
            color="primary"
            data-cy="btn-loc-agree"
            autoFocus
          >
            {t("Agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
