import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { SENDEVENT } from "../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { crawlers } from "../../utils/crawlers";
import {
  Menu,
  AppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Divider,
  Typography,
  makeStyles,
  ListSubheader,
  ListItemText,
} from "@material-ui/core/";

import {
  Share,
  Translate,
  MoreVert,
  DeveloperMode as DeveloperModeOn,
  PhonelinkErase as DeveloperModeOff,
} from "@material-ui/icons/";

import { share } from "../../utils/Share";
import { useGroup } from "../group/GroupContext";
import { useSettings } from "../settings/SettingsContext";
import { GroupHistoryList } from "./groupHistory/groupHistoryList";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "auto 96px",
  },
  menuButton: {
    color: "#ffffff",
    marginRight: theme.spacing(2),
  },
  iconButton: {
    color: "#ffffff",
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    marginBottom: 0,
  },
  title: {
    color: "#ffffff",
    flexGrow: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  titleLink: {
    color: "#ffffff",
    "text-decoration": "none",
  },
  menuWidthFix: {
    width: 240,
  },
}));

export const TopBar = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const client = useApolloClient();
  const group = useGroup();
  const uid = localStorage.getItem("uid");
  const { settings, updateSettings } = useSettings();
  const [devClicks, setDevClicks] = useState(0);

  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const openMenu = Boolean(anchorElMenu);

  const handleClickMenu = event => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDevClicks = () => {
    setDevClicks(prevClicks => prevClicks + 1);
  };

  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  useEffect(() => {
    if (devClicks >= 8) {
      updateSettings(prevState => ({
        ...prevState,
        devMode: !prevState.devMode,
      }));
      setDevClicks(0);
    }
  }, [devClicks, setDevClicks, updateSettings]);

  const { pathname } = useLocation();

  const handleShare = async () => {
    let allowEvent = false;
    try {
      share(
        `${process.env.REACT_APP_ENDPOINT}${pathname}?oid=${group.id}`,
        document.title,
        "",
        t("Your browser does not support share functionality")
      );
      allowEvent = true;
    } catch (err) {
      allowEvent = false;
      if (err) {
        alert(t("Your browser does not support share functionality"));
      } else {
        console.error(err);
      }
      return false;
    }
    if (allowEvent) handleEvent();
  };
  const handleEvent = () => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "evangelist",
              data: { path: pathname },
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleDevMode = () => {
    updateSettings(prevState => ({
      ...prevState,
      debug: !prevState.debug,
    }));
  };

  const changeLanguage = lang => {
    setAnchorEl(null);

    const localeGroup = group?.localizations.find(
      l => l => l.locale === i18n.language
    );

    localStorage.setItem("lang", lang);
    localStorage.setItem(
      "oid",
      localeGroup?.id || process.env.REACT_APP_DEFAULT_GROUP
    );
    client.resetStore().then(() => {
      window.location.replace(process.env.REACT_APP_ENDPOINT);
    });
    sendEvent({
      variables: {
        input: {
          data: {
            type: "languageChanged",
            data: {
              from: i18n.language === "fi" ? "fi" : "en",
              to: i18n.language === "fi" ? "en" : "fi",
            },
            group: group.id,
            uid: uid,
          },
        },
      },
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar
          className={settings.devMode ? null : classes.toolbar}
          style={
            settings.devMode
              ? { display: "grid", gridTemplateColumns: "auto 144px" }
              : {}
          }
        >
          <Typography variant="h6" className={classes.title}>
            <Link
              className={classes.titleLink}
              to="/"
              style={{ color: group?.textColor }}
            >
              {group?.name}
            </Link>
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ minWidth: 48 }} onClick={handleDevClicks}></div>
            {settings.devMode && (
              <IconButton
                aria-label="developer console"
                aria-controls="language-menu"
                className={classes.iconButton}
                aria-haspopup="true"
                onClick={handleDevMode}
                color="inherit"
                style={{ color: group?.textColor }}
              >
                {!settings.debug ? <DeveloperModeOn /> : <DeveloperModeOff />}
              </IconButton>
            )}
            <IconButton
              aria-label="share button"
              aria-controls="language-menu"
              className={classes.iconButton}
              aria-haspopup="true"
              onClick={handleShare}
              color="inherit"
              style={{ color: group?.textColor }}
              data-cy="btn-share"
            >
              <Share />
            </IconButton>

            {group?.localizations?.length > 0 && (
              <>
                <IconButton
                  data-cy="btn-lang-menu"
                  aria-label="language menu"
                  aria-controls="language-menu"
                  className={classes.iconButton}
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  style={{ color: group?.textColor }}
                >
                  <Translate />
                </IconButton>
                <Menu
                  id="language-menu"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                  color="inherit"
                  style={{ color: group?.textColor, zIndex: 1900 }}
                >
                  {i18n.language !== "fi" && (
                    <MenuItem
                      data-cy="btn-lang-choice"
                      onClick={() => {
                        changeLanguage("fi");
                      }}
                    >
                      <ListItemText primary="Suomeksi" />
                    </MenuItem>
                  )}
                  {i18n.language !== "en" && (
                    <MenuItem
                      data-cy="btn-lang-choice"
                      onClick={() => {
                        changeLanguage("en");
                      }}
                    >
                      <ListItemText primary="English" />
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
            <IconButton
              aria-label="more"
              id="main-menu-button"
              aria-controls={openMenu ? "main-menu" : undefined}
              aria-expanded={openMenu ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClickMenu}
              color="inherit"
              style={{ color: group?.textColor }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="main-menu"
              anchorEl={anchorElMenu}
              open={openMenu}
              onClose={handleCloseMenu}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              style={{ color: group?.textColor, zIndex: 1900 }}
            >
              {!process.env.REACT_APP_SERVER.includes("branded") && ( //DIG-999 Hides own groups on branded builds
                <div>
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader"
                    className={classes.menuWidthFix}
                  >
                    {t("Own groups")}
                  </ListSubheader>
                  <GroupHistoryList />
                  <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                </div>
              )}
              <MenuItem key="info" component={NavLink} to="/info">
                {t("Info")}
              </MenuItem>
              <MenuItem key="privacy" component={NavLink} to="/privacy-policy">
                {t("Privacy Policy")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
