import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  snackBar: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(7),
    zIndex: "1200",
    color: "white",
    padding: "0px 0px !important",
    maxWidth: "88%",
  },
}));

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}

export const PoiSnackbar = ({
  currentPlace,
  setSnackBar,
  placesInLocation,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const closeSnackBar = () => {
    setSnackBar(false);
  };

  return (
    <Snackbar
      className={classes.snackBar}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      TransitionComponent={TransitionRight}
      open={true}
      autoHideDuration={10000}
      onClose={closeSnackBar}
      message={currentPlace?.name}
      action={
        <>
          {!placesInLocation ? (
            <Button
              color="primary"
              size="small"
              component={Link}
              to={`/places/${currentPlace.id}`}
              onClick={() => setSnackBar(false)}
            >
              {t("Avaa")}
            </Button>
          ) : (
            <Button
              color="primary"
              size="small"
              component={Link}
              to={"/places-in-location"}
              onClick={() => setSnackBar(false)}
            >
              {t("Avaa")}
            </Button>
          )}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};
