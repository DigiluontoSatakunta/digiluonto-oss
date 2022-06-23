import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Grid,
  Card,
  Button,
  makeStyles,
  Typography,
  CardActions,
  CardContent,
  CardActionArea,
} from "@material-ui/core/";
import Rating from "@mui/material/Rating";

const useStyles = makeStyles(theme => ({
  oneCard: {
    display: "flex",
    flexDirection: "column",
    minWidth: 360,
    width: 360,
    padding: 4,
    [theme.breakpoints.down("xs")]: {
      minWidth: "70vw",
      maxWidth: "70vw",
      width: "auto",
    },
    [theme.breakpoints.up("900")]: {
      minWidth: "auto",
      width: "340px",
    },
    "& > div": {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#222222",
      backgroundSize: "cover",
    },
  },
  singleCard: {
    // when 1 card only
    [theme.breakpoints.down("xs")]: {
      minWidth: "98vw",
      maxWidth: "98vw",
      marginBottom: theme.spacing(3),
    },
  },
  journeyCard: {
    minHeight: 265,
    display: "flex",
    backgroundSize: "cover",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  limitedLengthDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "3",
    "-webkit-box-orient": "vertical",
  },
  cardButton: {
    color: "#ffffff",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    textShadow: "3px 2px 3px #00000066",
  },
  cardContent: {
    color: "#ffffff",
    textShadow: "3px 2px 3px #00000066",
    paddingBottom: 0,
    minWidth: "100%",
    boxSizing: "border-box",
    maxWidth: "min-content",
  },
}));

export const PlaceCard = ({ fromHome, place, journeyCount, data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const votedPlaces = JSON.parse(localStorage.getItem("votedPlaces") || "[]");

  return (
    <Grid
      item
      xs={12}
      className={
        journeyCount === 1
          ? `${classes.oneCard} ${classes.singleCard}`
          : classes.oneCard
      }
      data-element="journey-cards-card"
    >
      <Card
        className={classes.journeyCard}
        style={
          place?.cover?.formats?.medium || place?.cover?.url
            ? {
                backgroundImage: `linear-gradient(0deg, rgb(0 0 0 / 70%), #00000024, rgb(0 0 0 / 20%)), url(${
                  process.env.REACT_APP_STRAPI
                }${place?.cover?.formats?.medium?.url || place?.cover?.url})`,
              }
            : {}
        }
      >
        <CardActionArea
          style={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          component={Link}
          to={{
            pathname: `/places/${place?.id}`,
            state: { fromHome: fromHome },
          }}
        >
          <CardContent className={classes.cardContent}>
            <div style={{ backdropFilter: "blur(1px)" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="h5"
                data-element="journey-cards-card-title"
              >
                {place?.name}
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
        {votedPlaces.map(voted => {
          if (voted.placId === place.id) {
            return (
              <CardContent className={classes.cardContent}>
                <Typography
                  style={{
                    marginBottom: 4,
                  }}
                  paragraph
                >
                  {t("Own evaluation")}
                </Typography>
                <Rating
                  name="simple-controlled"
                  style={{ fontSize: "1.2rem", marginBottom: 12 }}
                  value={voted.rating}
                  readOnly={true}
                />
                <AverageValue place={place} data={data} />
              </CardContent>
            );
          } else return null;
        })}

        <CardActions>
          <Button
            size="small"
            color="primary"
            component={Link}
            to={{
              pathname: `/places/${place?.id}`,
              state: { fromHome: true },
            }}
            className={classes.cardButton}
          >
            {t("Check out")}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

const AverageValue = ({ place, data }) => {
  const classes = useStyles();
  const [ratingValue, setRatingValue] = useState();
  const { t } = useTranslation();
  const checkIfRated = useCallback(() => {
    let ratingArray = [];

    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

    data?.events?.forEach(event => {
      if (event?.place?.id === place?.id && event?.data?.rating) {
        ratingArray.push(event?.data?.rating);
      }
      if (ratingArray.length >= 1 && event?.place?.id === place?.id) {
        const result = average(ratingArray);
        setRatingValue(Math.round(result, 1.0));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) checkIfRated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Typography
      style={{
        color: "#ffffff",
        textShadow: "3px 2px 3px #00000066",
        marginBottom: 0,
      }}
      paragraph
    >
      {t("Average")} {ratingValue} / 5
    </Typography>
  );
};
