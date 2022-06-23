import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fab from "@material-ui/core/Fab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { BadgeContent } from "./BadgeContent";
const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute !important",
    top: theme.spacing(24),
    left: theme.spacing(2),
    zIndex: "401",
    color: theme.palette.icon.main,
    background: theme.palette.primary.main,
    width: "35px",
    height: "35px",
  },
}));

export const BadgeDrawer = ({
  setReactedBadge,
  setBadgeMessage,
  badgeMessage,
  reactedBadge,
  activeJourney,
  setOpenJourneyDrawer,
  setOpenDrawer,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const color =
    theme.palette.primary.main !== "#ffffff" ? "primary" : "secondary";
  const toggleDrawer = open => event => {
    setOpenJourneyDrawer(false);
    setOpenDrawer(false);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
    setBadgeMessage(false);
  };

  return (
    <div>
      {/* {badgeMessage ? (
        <Fab
          color={color}
          aria-label="center"
          className={classes.fab}
          onClick={toggleDrawer(true)}
        >
          <MessageIcon fontSize="small" />
        </Fab>
      ) : ( */}
      <Fab
        color={color}
        aria-label="center"
        className={classes.fab}
        onClick={toggleDrawer(true)}
      >
        <EmojiEventsIcon fontSize="small" />
      </Fab>
      {/* )} */}
      <Drawer
        style={{ zIndex: 1500 }}
        anchor={"left"}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: "90vw" }} role="presentation">
          <BadgeContent
            setReactedBadge={setReactedBadge}
            badgeMessage={badgeMessage}
            reactedBadge={reactedBadge}
            activeJourney={activeJourney}
            setOpen={setOpen}
          />
        </Box>
      </Drawer>
    </div>
  );
};
