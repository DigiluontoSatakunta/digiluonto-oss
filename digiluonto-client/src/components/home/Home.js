import React, { useMemo } from "react";
// import loadable from "@loadable/component";
import { Skeleton } from "@material-ui/lab/";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { EXPERIENCES, OTHERJOURNEYS } from "../../gql/queries/Journeys";

import { useGroup } from "../group/GroupContext";
import { useLocation } from "../location/LocationContext";
import { LocationDialog } from "../location/LocationDialog";
import { useWindowSize } from "../../utils/WindowSize";

import {
  Grid,
  Card,
  Divider,
  CardMedia,
  makeStyles,
  Typography,
  CardActions,
  CardContent,
  CardActionArea,
} from "@material-ui/core/";

import { speakOutLoud } from "../../utils/SpeakOutLoud";
import { useSettings } from "../settings/SettingsContext";
import { GroupList } from "../group/GroupList";

import { JourneyCards } from "../cards/JourneyCards";

const useStyles = makeStyles(theme => ({
  cards: {
    padding: theme.spacing(3),
    backgroundColor: "#fafafa",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  card: {
    position: "relative",
    minHeight: 290,
    display: "flex",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background:
        "linear-gradient(0deg, rgb(0 0 0 / 54%), transparent, rgb(0 0 0 / 52%))",
    },
  },
  bear: {
    position: "absolute",
    bottom: 0,
    zIndex: 5,
    width: 140,
    height: "auto",
    filter: "drop-shadow(2px 3px 3px rgba(0,0,0,.5))",
  },
  bubble: {
    position: "absolute",
    left: 120,
    bottom: 18,
    background: "#fff",
    zIndex: 4,
    right: 12,
    padding: 12,
    borderRadius: 12,
    filter: "drop-shadow(2px 3px 3px rgba(0,0,0,.5))",
  },
  nobubble: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    fontSize: 16,
    color: "#fff",
    background: "linear-gradient(0deg, rgb(0 0 0 / 25%), transparent)",
    padding: "48px 16px 16px 16px",
    zIndex: 1,
    "& > div > a": {
      color: "#fff",
      textAlign: "left",
    },
  },
  homepage: {
    textDecoration: "none",
    color: "#222222",
    display: "block",
    textAlign: "right",
    marginTop: theme.spacing(1),
  },
  limitedLengthDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "3",
    "-webkit-box-orient": "vertical",
  },
  subtitle: {
    marginTop: theme.spacing(4),
    minWidth: "100%",
    display: "block",
    fontSize: "1.9rem",
  },
  oneCard: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      padding: 4,
      scrollSnapAlign: "center",
      minWidth: "86vw",
      maxWidth: "86vw",
    },
    "& > div": {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#222222",
      backgroundSize: "cover",
    },
  },
  rahoittaja: {
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 16,
    minWidth: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    borderTop: "1px solid #bdbdbd4f",
  },
}));

export const Home = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const group = useGroup();
  const { settings } = useSettings();
  const [width] = useWindowSize();

  const coverPhoto = useMemo(() => {
    const mobileCover = group?.cover?.formats?.medium?.url
      ? group.cover.formats.medium.url
      : group?.cover?.url
      ? group.cover.url
      : null;
    const desktopCover = group?.desktopCover?.url;
    let coverPhoto = `/digiluonto_tausta_1.jpg`;

    coverPhoto = mobileCover
      ? `${process.env.REACT_APP_STRAPI}${mobileCover}`
      : coverPhoto;

    if (mobileCover && desktopCover) {
      coverPhoto =
        width > 700
          ? `${process.env.REACT_APP_STRAPI}${desktopCover}`
          : `${process.env.REACT_APP_STRAPI}${mobileCover}`;
    }

    return coverPhoto;
  }, [width, group]);

  return (
    <>
      <LocationDialog />
      <div style={{ overflowY: "auto" }}>
        <Card elevation={0} square={true} className={classes.card}>
          <CardMedia
            component="img"
            alt="Photo"
            image={coverPhoto}
            title="Photo"
            style={{ maxHeight: 360 }}
          />
          {group?.showMascot === true && (
            <img
              src="/profile.png"
              id="mascot"
              alt="Bear"
              onClick={() =>
                speakOutLoud(
                  i18n.language,
                  `Mur mur. ${
                    group?.welcome
                      ? group.welcome
                      : t("Welcome text in landing page")
                  }`
                )
              }
              className={classes.bear}
            />
          )}
          <div
            id={group?.showMascot ? "mascot-bubble" : "mascot-nobubble"}
            className={group?.showMascot ? classes.bubble : classes.nobubble}
            data-cy="content-bubble"
          >
            {group?.welcome ? (
              <div>
                {group.welcome}

                {group?.homepageTitle && group?.homepageUrl && (
                  <a className={classes.homepage} href={group.homepageUrl}>
                    {group.homepageTitle}
                  </a>
                )}
              </div>
            ) : (
              <div>{t("Welcome text in landing page")}</div>
            )}
          </div>
        </Card>

        <div className={classes.cards}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h5"
                variant="h4"
                className={classes.intro}
                data-cy="content-nearby"
              >
                {t("Experiences")}
              </Typography>
            </Grid>
            <Experiences />

            {group.showPublicContent && (
              <>
                <Grid item xs={12}>
                  <Typography
                    component="h5"
                    variant="h4"
                    className={classes.intro}
                    data-cy="content-featured"
                  >
                    {t("Other experiences")}
                  </Typography>
                </Grid>
                <OtherExperiences />
              </>
            )}

            {settings.devMode && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Divider
                      style={{
                        marginTop: 16,
                        marginBottom: 24,
                        marginRight: 0,
                        marginLeft: 0,
                      }}
                    />
                    <GroupList />
                  </Grid>
                </Grid>
              </>
            )}

            {group.name === "Digiluonto" && (
              <Grid container spacing={2}>
                <div className={classes.rahoittaja}>
                  <img
                    src="/maaseutu2020.png"
                    alt="Euroopan maaseuturahasto"
                    style={{ width: "auto", height: 52 }}
                  />
                  <img
                    src="/maatalousrahasto-small.jpg"
                    alt="Euroopan maaseuturahasto"
                    style={{ width: "auto", height: 36 }}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

const OtherExperiences = () => {
  const { i18n } = useTranslation();
  const { location } = useLocation();
  const group = useGroup();

  const { loading, error, data } = useQuery(OTHERJOURNEYS, {
    variables: {
      latitude: parseFloat(location?.[0]),
      longitude: parseFloat(location?.[1]),
      distance: 1300000,
      group: group?.id,
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <ListSkeleton />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      {data.findOtherJourneysByLocation.length > 0 && (
        <JourneyCards
          fromHome={true}
          journeys={data.findOtherJourneysByLocation}
          prefix="other-expriences"
        />
      )}
    </>
  );
};

const Experiences = () => {
  const { i18n } = useTranslation();
  const { location } = useLocation();
  const group = useGroup();

  const { loading, error, data } = useQuery(EXPERIENCES, {
    variables: {
      latitude: parseFloat(location?.[0]),
      longitude: parseFloat(location?.[1]),
      distance: 1300000,
      group: group?.id,
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <ListSkeleton />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      {data.findGroupJourneysByLocation.length > 0 && (
        <JourneyCards
          fromHome={true}
          journeys={data.findGroupJourneysByLocation}
          prefix="expriences"
        />
      )}
    </>
  );
};

const ListSkeleton = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div style={{ overflowY: "auto" }}>
      <Card
        elevation={0}
        square={true}
        className={classes.card}
        style={{ display: "flex" }}
      >
        <Skeleton variant="rect" width="100%" height={300} animation="wave" />
      </Card>

      <div className={classes.cards}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography component="h5" variant="h4" className={classes.intro}>
              {t("Journeys")}
            </Typography>
          </Grid>

          <Grid container spacing={2}>
            {[1].map((journey, i) => (
              <Grid
                item
                key={i}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className={classes.oneCard}
              >
                <Card>
                  <CardActionArea style={{ flex: 1 }}>
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={200}
                      animation="wave"
                    />

                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h5">
                        <Skeleton
                          variant="text"
                          width="100%"
                          animation="wave"
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        className={classes.limitedLengthDescription}
                      >
                        <Skeleton
                          variant="text"
                          width="100%"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width="100%"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width="100%"
                          animation="wave"
                        />
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Skeleton
                      variant="rect"
                      width="50%"
                      height={40}
                      animation="wave"
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
