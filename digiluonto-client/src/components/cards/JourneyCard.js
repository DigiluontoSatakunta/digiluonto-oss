import React from "react";
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

import { JourneyCardGroupLogo } from "./JourneyCardGroupLogo";

const useStyles = makeStyles(theme => ({
  oneCard: {
    display: "flex",
    flexDirection: "column",
    minWidth: 360,
    width: 360,
    padding: 4,
    [theme.breakpoints.down("xs")]: {
      minWidth: "86vw",
      maxWidth: "86vw",
      width: "auto",
    },
    [theme.breakpoints.up("900")]: {
      minWidth: "auto",
      width: "100%",
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

export const JourneyCard = ({ fromHome, journey, journeyCount }) => {
  const classes = useStyles();
  const { t } = useTranslation();

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
          journey?.cover?.formats?.medium || journey?.cover?.url
            ? {
                backgroundImage: `linear-gradient(0deg, rgb(0 0 0 / 70%), #00000024, rgb(0 0 0 / 20%)), url(${
                  process.env.REACT_APP_STRAPI
                }${
                  journey?.cover?.formats?.medium?.url || journey?.cover?.url
                })`,
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
            pathname: `/journeys/${journey.id}`,
            state: { fromHome: fromHome },
          }}
        >
          <CardContent className={classes.cardContent}>
            <JourneyCardGroupLogo group={journey?.ownerGroup} />
            <div style={{ backdropFilter: "blur(1px)" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="h5"
                data-element="journey-cards-card-title"
              >
                {journey.name}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={classes.limitedLengthDescription}
                data-element="journey-cards-card-description"
              >
                {journey.excerpt}
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            component={Link}
            to={{
              pathname: `/journeys/${journey.id}`,
              state: { fromHome: true },
            }}
            className={classes.cardButton}
          >
            {t("Take a Journey")}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
