import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import loadable from "@loadable/component";

// eslint-disable-next-line
import i18n from "../../i18n";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import amber from "@material-ui/core/colors/amber";
import { makeStyles } from "@material-ui/core/styles";

import { BottomBar } from "../bottombar/BottomBar";
import { Cookie } from "../bottombar/Cookie";
import { TopBar } from "../topbar/TopBar";

import { useGroup } from "../group/Group";
import { GroupProvider } from "../group/GroupContext";
import { useSettings } from "../settings/Settings";
import { SettingsProvider } from "../settings/SettingsContext";
import { LocationProvider } from "../location/LocationContext";
import "./App.css";

import { SENDEVENT } from "../../gql/mutations/Event";
import { useMutation } from "@apollo/client";
import { crawlers } from "../../utils/crawlers";

const Error404 = loadable(
  () => import(/* webpackChunkName: "errorPages" */ "../error404/Error404"),
  { resolveComponent: components => components.default }
); // FIXME: Error404 module uses "export default" for its component
const MapContainer = loadable(
  () =>
    import(
      /* webpackChunkName: "mapContainer" */ "../mapcontainer/MapContainer"
    ),
  { resolveComponent: components => components.MapContainer }
);

const Camera = loadable(
  () => import(/* webpackChunkName: "camera" */ "../camera/Camera"),
  { resolveComponent: components => components.default }
); // FIXME: Camera module uses "export default" for its component

const PrivacyPolicy = loadable(
  () => import(/* webpackChunkName: "aboutPages" */ "../pages/PrivacyPolicy"),
  { resolveComponent: components => components.PrivacyPolicy }
);

const Home = loadable(
  () => import(/* webpackChunkName: "home" */ "../home/Home"),
  { resolveComponent: components => components.Home }
);

const Info = loadable(
  () => import(/* webpackChunkName: "aboutPages" */ "../info/Info"),
  { resolveComponent: components => components.Info }
);

const AddFavouriteRedirect = loadable(
  () =>
    import(
      /* webpackChunkName: "redirs" */ "../favourite/AddFavouriteRedirect"
    ),
  { resolveComponent: components => components.AddFavouriteRedirect }
);
const AddDevModeRedirect = loadable(
  () => import(/* webpackChunkName: "redirs" */ "../dev/AddDevModeRedirect"),
  { resolveComponent: components => components.AddDevModeRedirect }
);
const AddPreviewModeRedirect = loadable(
  () =>
    import(
      /* webpackChunkName: "redirs" */ "../preview/AddPreviewModeRedirect"
    ),
  { resolveComponent: components => components.AddPreviewModeRedirect }
);

const ArCamera = loadable(
  () => import(/* webpackChunkName: "cameraAr" */ "../camera/ArCamera"),
  { resolveComponent: components => components.ArCamera }
);
const QrCamera = loadable(
  () => import(/* webpackChunkName: "cameraQr" */ "../camera/QrCamera"),
  { resolveComponent: components => components.QrCamera }
);

let theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 410,
      md: 769,
      lg: 1080,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: amber[500],
    },
    secondary: indigo,
  },
});

const useStyles = makeStyles(() => ({
  digiluontoHeader: {
    zIndex: 1001,
  },
}));

export const App = ({ orgId }) => {
  const classes = useStyles();
  const client = useApolloClient();
  const { t, i18n } = useTranslation();
  const settings = useSettings();
  const uid = localStorage.getItem("uid");
  const [expandPlace, setExpandPlace] = useState();
  const group = useGroup(orgId);
  const [location] = useState([
    process.env.REACT_APP_DEFAULT_LATITUDE,
    process.env.REACT_APP_DEFAULT_LONGITUDE,
  ]);
  const [sendEvent] = useMutation(SENDEVENT, {
    onCompleted(response) {},
  });

  const changeLanguage = lng => {
    localStorage.setItem("lang", lng);
    i18n.changeLanguage(lng);
    client.resetStore();
  };

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "joinedGroup",
              group: group.id,
              uid: uid,
            },
          },
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!group) return null;

  if (group.locale !== i18n.language) changeLanguage(group.locale);

  // ryhmän tunniste talteen tulevaan käyttöön
  localStorage.setItem("oid", group.id);
  // luetaan vanhat oid:t
  const oids = JSON.parse(localStorage.getItem("oids") || "[]");
  // asetetaan nykyinen oid muistiin aiempien kanssa.
  localStorage.setItem(
    "oids",
    JSON.stringify([...new Set([...oids, group.id])])
  );

  theme = createTheme({
    palette: {
      primary: {
        main: group.primaryColor || amber[500],
      },
      secondary: {
        main: group.secondaryColor || indigo,
      },
      icon: {
        main: group.textColor || "#ffffff",
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: i18n.language,
        }}
      >
        <title>{group?.name || t("Digiluonto")}</title>
        <meta
          name="description"
          content={group?.welcome || t("Digiluonto description")}
        />
        <meta name="theme-color" content={group?.primaryColor || "#212121"} />
        <meta property="og:title" content={group?.name || t("Digiluonto")} />
        <meta property="og:description" content={t("Digiluonto description")} />
        <meta
          property="og:image"
          content={`${process.env.REACT_APP_STRAPI}/uploads/digiluonto_kansikuva_8652ae6ad9.jpg`}
        />
        <meta property="og:type" content={`website`} />
        <meta property="og:locale" content={i18n.language} />
      </Helmet>
      <GroupProvider value={group}>
        <SettingsProvider value={settings}>
          <ThemeProvider theme={theme}>
            <LocationProvider
              value={
                group?.latitude ? [group?.latitude, group?.longitude] : location
              }
            >
              <Router>
                <div className="App">
                  <header
                    className={classes.digiluontoHeader}
                    data-cy="content-header"
                  >
                    <TopBar settings={settings} />
                  </header>
                  <main className={classes.digiluontoMain}>
                    <Switch>
                      <Route path="/privacy-policy">
                        <PrivacyPolicy />
                      </Route>
                      <Route path="/info">
                        <Info />
                      </Route>

                      <Route path="/" exact>
                        <Home />
                      </Route>
                      <Route
                        path={[
                          "/map",
                          "/tags",
                          "/news",
                          "/nearme",
                          "/places-in-location",
                          "/places/:id",
                          "/journeys/:id",
                        ]}
                      >
                        <MapContainer
                          expandPlace={expandPlace}
                          setExpandPlace={setExpandPlace}
                        />
                      </Route>
                      <Route path="/add-favourite">
                        <AddFavouriteRedirect />
                      </Route>
                      <Route path="/dev">
                        <AddDevModeRedirect />
                      </Route>
                      <Route path="/preview/:id">
                        <AddPreviewModeRedirect />
                      </Route>
                      <Route path="/camera">
                        <Camera />
                      </Route>
                      <Route path="/arcamera/:id">
                        <ArCamera />
                      </Route>
                      <Route path="/qrcamera/:id/:token">
                        <QrCamera />
                      </Route>
                      <Route path={["/places", "/journeys"]} exact>
                        <Redirect to="/nearme" />
                      </Route>
                      <Route component={Error404} />
                    </Switch>
                  </main>
                  <footer style={{ zIndex: 1501 }}>
                    <BottomBar
                      expandPlace={expandPlace}
                      setExpandPlace={setExpandPlace}
                    />
                    <Cookie />
                  </footer>
                </div>
              </Router>
            </LocationProvider>
          </ThemeProvider>
        </SettingsProvider>
      </GroupProvider>
    </>
  );
};
