import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@material-ui/lab/";

import {
  makeStyles,
  Grid,
  Paper,
  Card,
  Button,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core/";

import { getDistance } from "geolib";
import { useLocation } from "../../location/LocationContext";
import { useSettings } from "../../settings/SettingsContext";
import { JOURNEYBYID } from "../../../gql/queries/Journeys";

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 0,
    color: theme.palette.text.secondary,
    backgroundColor: "#fafafa",
    marginTop: 16,
    paddingBottom: 32,
  },
  cardMedia: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    marginBottom: 8,
  },
  nextPlaceButton: {
    minWidth: "100%",
    marginTop: "16px",
    color: theme.palette.icon.main,
  },
}));

export const NextPlaceInJourney = ({
  placeId,
  activeJourney,
  setActivePlace,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { location } = useLocation();
  const { settings } = useSettings();

  const { loading, error, data } = useQuery(JOURNEYBYID, {
    variables: {
      id: activeJourney.id,
      publicationState: settings.previewMode ? "PREVIEW" : "LIVE",
    },
  });

  if (loading) return <ListSkeleton />;
  if (error) return <p>{error.message}</p>;

  const places = data.journey?.places;
  const currentIndex = places?.findIndex(place => place.id === placeId);
  const place = places[1 + currentIndex];

  if (!place) return ""; // last place in journey

  const distance = getDistance(
    {
      latitude: place.geoJSON.geometry.coordinates[1],
      longitude: place.geoJSON.geometry.coordinates[0],
    },
    {
      latitude: location?.[0],
      longitude: location?.[1],
    }
  );

  const humanReadableDistance =
    distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;

  return (
    <>
      <Typography component="h4" variant="h4" className={classes.subtitle}>
        {t("Next place")}
      </Typography>
      <Paper className={classes.paper} elevation={0}>
        <Card elevation={1}>
          {(place?.cover?.formats?.medium?.url || place?.cover?.url) && (
            <CardMedia
              component="img"
              alt="Photo"
              image={`${process.env.REACT_APP_STRAPI}${
                place?.cover?.formats?.medium?.url || place?.cover?.url
              }`}
              title="Photo"
              className={classes.cardMedia}
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h5">
              {place.name}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              component="p"
              style={{ marginBottom: 16 }}
            >
              {place.description}
            </Typography>
            <Typography variant="body1" color="textPrimary" component="p">
              <strong>
                <span style={{ textTransform: "capitalize" }}>{t("dist")}</span>
                : {humanReadableDistance}
              </strong>
            </Typography>
            <Button
              className={classes.nextPlaceButton}
              variant="contained"
              color="primary"
              onClick={() => {
                setActivePlace(place);
              }}
              to="/map"
              component={Link}
              title={place.name}
            >
              {t("Show next place on map")}
            </Button>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

function ListSkeleton() {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} style={{ padding: 16 }}>
        <Paper className={classes.paper} elevation={0}>
          <Skeleton variant="rect" width="100%" height={320} animation="wave" />
        </Paper>
      </Grid>
    </Grid>
  );
}
