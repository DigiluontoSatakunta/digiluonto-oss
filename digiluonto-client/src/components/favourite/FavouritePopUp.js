import React, { useEffect, useRef, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Marker, Popup } from "react-leaflet";
import { Fab } from "@material-ui/core";
import { Cancel, AddCircle } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ExternalContent } from "../slider/content/types/ExternalContent";
import { FavouriteIcon } from "../map/icons/FavouriteIcon";
import { useSettings } from "../settings/SettingsContext";
const useStyles = makeStyles(theme => ({
  popupText: {
    padding: "14px",
    boxSizing: "border-box",
  },
  popupTitle: {
    margin: 0,
  },
  fab: {
    position: "absolute",
    right: theme.spacing(2),
    color: theme.palette.icon.main,
    backgroundColor: theme.palette.primary.main,
  },
  fab2: {
    color: theme.palette.icon.main,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const FavouritePopUp = ({ favouriteLocation }) => {
  const theme = useTheme();
  const classes = useStyles();

  const { t } = useTranslation();
  const { updateSettings } = useSettings();

  const markerRef = useRef();

  const [open, setOpen] = useState(false);
  const [locatedOnce, setLocatedOnce] = useState(false);

  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";

  const cancelFavouriteMode = () => {
    updateSettings(prevState => ({
      ...prevState,
      favMode: !prevState.favMode,
    }));
  };

  const link = {
    url:
      "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSf7Jg4UKsxC0ek8Bm1M05RgUCv0zazJkz5RcAIpc4qr21AqEA/viewform?entry." +
      `544374091=${favouriteLocation.lat?.toFixed(
        5
      )},%20${favouriteLocation.lng?.toFixed(5)}`,
  };

  useEffect(() => {
    if (favouriteLocation && !locatedOnce) {
      markerRef.current.openPopup(favouriteLocation);
      setLocatedOnce(true);
    }
  }, [markerRef, locatedOnce, favouriteLocation]);

  const addFavouritePlace = () => {
    setOpen(true);
  };

  return (
    <Marker
      icon={FavouriteIcon}
      ref={markerRef}
      position={favouriteLocation}
      draggable={true}
    >
      <Popup autoPan={true}>
        <div className={classes.popupText}>
          <h2 className={classes.popupTitle}>{t("Suosikkikohteen asetus")}</h2>
          <p>
            <Trans>
              To add your favorite place, press the add button. If you want to
              continue using the map normally close your favorite mode close
              button.
            </Trans>
          </p>
          <div className={classes.activeLinkAvatarName}>
            <Fab
              color={color}
              aria-label="center"
              className={classes.fab}
              size="small"
              onClick={addFavouritePlace}
            >
              <AddCircle />
            </Fab>
            <Fab
              color={color}
              aria-label="center"
              className={classes.fab2}
              size="small"
              onClick={cancelFavouriteMode}
            >
              <Cancel />
            </Fab>
            <ExternalContent link={link} open={open} setOpen={setOpen} />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
