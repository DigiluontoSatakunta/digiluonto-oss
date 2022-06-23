import React, { useState, memo, useEffect } from "react";

import { Favorite, AddCircle } from "@material-ui/icons";
import { ClickAwayListener, Tooltip, Fab } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSettings } from "../../settings/SettingsContext";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(12),
    right: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
  },
  toolTip: {
    width: "60%",
    fontSize: "1rem",
  },
}));

export const FavouriteFab = memo(() => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const { updateSettings, settings } = useSettings();

  const handleTooltipOpen = () => {
    setOpen(true);
    updateSettings(prevState => ({
      ...prevState,
      favMode: !prevState.favMode,
    }));
  };

  useEffect(() => {
    if (settings.favMode) setOpen(true);
  }, [settings.favMode]);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      {settings.favMode ? (
        <Tooltip
          PopperProps={{
            disablePortal: false,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={t(
            "You can now set your favorite location by clicking on the map or dragging the location to the location you want. Click on a place to open more information."
          )}
          placement="left"
          classes={{ tooltip: classes.toolTip }}
        >
          <Fab
            color={color}
            aria-label="center"
            className={classes.fab}
            onClick={handleTooltipOpen}
          >
            <AddCircle />
          </Fab>
        </Tooltip>
      ) : (
        <Tooltip
          PopperProps={{
            disablePortal: false,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={t("Adding favorite place is now closed")}
          placement="left"
          classes={{ tooltip: classes.toolTip }}
        >
          <Fab
            color={color}
            aria-label="center"
            className={classes.fab}
            onClick={handleTooltipOpen}
          >
            <Favorite />
          </Fab>
        </Tooltip>
      )}
    </ClickAwayListener>
  );
});
