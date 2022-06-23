import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core/";

import {
  Map,
  Apps,
  Explore,
  FilterList,
  DoubleArrow,
} from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  rootBar: {
    backgroundColor: "#212121",
    zIndex: theme.zIndex.drawer - 1,
  },
  nav: {
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navDisabled: {
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowMore: {
    transform: "rotate(270deg)",
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowMoreActive: {
    transform: "rotate(270deg)",
    color: theme.palette.primary.main,
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowLess: {
    transform: "rotate(90deg)",
    color: "#9e9e9e",
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  navArrowLessActivated: {
    transform: "rotate(90deg)",
    color: theme.palette.primary.main,
    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  muiSelected: {
    color: theme.palette.secondary.main,
    paddingTop: "6px",
  },
  sideDrawer: {
    "& .MuiDrawer-paper": {
      bottom: "56px", //imp
      border: "none",
      // background: "#fff0",
      zIndex: 100,
    },
  },
  navArrowMoreDisabled: {
    transform: "rotate(270deg)",

    minWidth: "40px",
    [theme.breakpoints.only("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

export const BottomBar = ({ pageId, expandPlace, setExpandPlace }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className={classes.root}>
      <BottomNavigation value={pageId} showLabels className={classes.rootBar}>
        <BottomNavigationAction
          className={classes.nav}
          label={t("Explore")}
          icon={<Apps />}
          component={NavLink}
          to="/"
          isActive={() => "/" === pathname}
          activeClassName={classes.muiSelected}
          data-cy="nav-explore"
        />

        {/* <BottomNavigationAction
        className={classes.nav}
        label={t("Info")}
        icon={<Info />}
        component={NavLink}
        to="/info"
        activeClassName={classes.muiSelected}
        data-cy="nav-info"
      /> */}
        <BottomNavigationAction
          className={classes.nav}
          label={t("Filter")}
          icon={<FilterList />}
          component={NavLink}
          to="/tags"
          activeClassName={classes.muiSelected}
          data-cy="nav-filter"
        />
        {pathname === `/places/${expandPlace?.id}` ||
        pathname.startsWith("/places") ||
        pathname.startsWith("/journeys") ? (
          <BottomNavigationAction
            className={classes.nav}
            label={t("Less")}
            icon={
              <DoubleArrow
                className={
                  pathname.startsWith("/places") ||
                  pathname.startsWith("/journeys")
                    ? classes.navArrowLessActivated
                    : classes.navArrowLess
                }
              />
            }
            component={NavLink}
            isActive={() =>
              ["/journeys", "/places"].find(str => !!pathname.startsWith(str))
            }
            to="/map"
            activeClassName={classes.muiSelected}
            data-cy="nav-filter"
          />
        ) : expandPlace ? (
          <BottomNavigationAction
            className={classes.nav}
            label={t("More")}
            icon={<DoubleArrow className={classes.navArrowMore} />}
            // onClick={() => setExpandMorePlace(true)}
            component={NavLink}
            to={
              expandPlace.__typename === "Journey"
                ? `/journeys/${expandPlace?.id}`
                : `/places/${expandPlace?.id}`
            }
            activeClassName={classes.muiSelected}
            data-cy="nav-filter"
          />
        ) : (
          <BottomNavigationAction
            // className={classes.nav}
            label={t("More")}
            icon={<DoubleArrow className={classes.navArrowMoreDisabled} />}
            // onClick={() => setExpandMorePlace(true)}
            disabled
            data-cy="nav-filter"
          />
        )}

        <BottomNavigationAction
          className={classes.nav}
          label={t("Near Me")}
          icon={<Explore />}
          component={NavLink}
          to="/nearme"
          isActive={() => ["/nearme"].find(str => !!pathname.startsWith(str))}
          activeClassName={classes.muiSelected}
          data-cy="nav-nearme"
        />

        <BottomNavigationAction
          className={classes.nav}
          label={t("Map")}
          component={NavLink}
          to="/map"
          activeClassName={classes.muiSelected}
          icon={<Map />}
          data-cy="nav-map"
        />
      </BottomNavigation>
    </div>
  );
};
