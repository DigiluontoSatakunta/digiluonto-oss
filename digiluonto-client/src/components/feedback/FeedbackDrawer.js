import * as React from "react";

import Box from "@mui/material/Box";
import Fab from "@material-ui/core/Fab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@mui/material/Drawer";
import FeedbackIcon from "@mui/icons-material/Feedback";

import { FeedbackForm } from "./FeedbackForm";

const useStyles = makeStyles(theme => ({
  fab: {
    position: "absolute",
    top: theme.spacing(18),
    left: theme.spacing(2),
    zIndex: 401,
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    color: theme.palette.icon.main,
    background: theme.palette.primary.main,
  },
}));

export const FeedbackDrawer = ({ setOpenJourneyDrawer, setOpenDrawer }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
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
  };

  return (
    <div>
      <Fab
        color={color}
        aria-label="center"
        className={classes.fab}
        onClick={toggleDrawer(true)}
      >
        <FeedbackIcon fontSize="small" />
      </Fab>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: "90vw" }} role="presentation">
          <FeedbackForm />
        </Box>
      </Drawer>
    </div>
  );
};
