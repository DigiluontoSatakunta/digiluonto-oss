import React, { useEffect } from "react";
import { Skeleton } from "@material-ui/lab/";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { NEARMEJOURNEYS } from "../../gql/queries/Journeys";

import { useGroup } from "../group/GroupContext";
import { useLocation } from "../location/LocationContext";
import { NearMeJourneyCards } from "./NearMeJourneyCards";

import {
  Grid,
  Card,
  makeStyles,
  Typography,
  CardActions,
  CardContent,
  CardActionArea,
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  cards: {
    padding: theme.spacing(3),
    backgroundColor: "#fafafa",
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
  limitedLengthDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": "3",
    "-webkit-box-orient": "vertical",
  },
}));

export const NearByJourneyCards = ({ fromHome = true }) => {
  const { i18n } = useTranslation();
  const { location } = useLocation();
  const group = useGroup();

  const { data, loading, error, refetch } = useQuery(NEARMEJOURNEYS, {
    variables: {
      latitude: parseFloat(location?.[0]),
      longitude: parseFloat(location?.[1]),
      distance: 1300000,
      group: group?.id,
      locale: i18n.language,
      limit: 18,
    },
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    refetch({
      latitude: Number.parseFloat(location[0]),
      longitude: Number.parseFloat(location[1]),
    });
  }, [refetch, location]);

  if (loading) return <ListSkeleton />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      {data.journeysByLocation.length > 0 && (
        <NearMeJourneyCards journeys={data.journeysByLocation} />
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
