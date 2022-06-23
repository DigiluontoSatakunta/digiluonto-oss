import React, { useCallback, useEffect, useState } from "react";
import {
  makeStyles,
  Paper,
  Card,
  Button,
  CardContent,
  Typography,
  Box,
} from "@material-ui/core/";
import Rating from "@mui/material/Rating";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { RATING_QUERY } from "../../../gql/queries/Events";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useQuery } from "@apollo/client";
import { useSettings } from "../../settings/SettingsContext";
import { useGroup } from "../../group/GroupContext";
import { crawlers } from "../../../utils/crawlers";
const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 0,
    color: theme.palette.text.secondary,
    backgroundColor: "#fafafa",
    marginTop: 16,
  },
  cardMedia: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    maxWidth: 100,
    float: "left",
  },
  subtitle: {
    marginBottom: 8,
  },
  nextPlaceButton: {
    minWidth: "90%",
    marginTop: "15px",
    color: theme.palette.icon.main,
  },
  box: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: 15,
  },
  boxWithImg: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 15,
  },
}));

export const JourneyReviewCard = ({ journey }) => {
  const [ratingValue, setRatingValue] = useState(0);
  const classes = useStyles();
  const { t } = useTranslation();
  const [responseMessage, setResponseMessage] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [foundFromData, setFoundFromData] = useState(false);
  const uid = localStorage.getItem("uid");
  const settings = useSettings();
  const group = useGroup();
  const { handleSubmit } = useForm();

  const { data, loadingData, errorData } = useQuery(RATING_QUERY);
  const votedJourneys = JSON.parse(
    localStorage.getItem("votedJourneys") || "[]"
  );
  const message = t("Thank you for your feedback!");
  const [sendEvent, { loading, error }] = useMutation(SENDEVENT, {
    onCompleted(response) {
      if (response?.createEvent?.event?.id) {
        setResponseMessage(message);
      }
    },
  });
  const onSubmit = () => {
    const votedJourney = { journeyId: journey.id, rating: ratingValue };
    localStorage.setItem("votedJourneys", JSON.stringify(votedJourney));
    try {
      votedJourneys.push({ journeyId: journey.id, rating: ratingValue });
      localStorage.setItem("votedJourneys", JSON.stringify(votedJourneys));
    } catch {
      localStorage.setItem("votedJourneys", "[]");
    }
    const userAgent = navigator.userAgent;
    if (!crawlers.includes(userAgent) && group && !settings?.debug) {
      sendEvent({
        variables: {
          input: {
            data: {
              type: "rating",
              data: { rating: ratingValue },
              journey: journey.id,
              uid: uid,
            },
          },
        },
      });
    }
  };
  const checkIfRated = useCallback(() => {
    let ratingArray = [];

    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

    data?.events?.forEach(event => {
      if (event?.journey?.id === journey?.id && event?.data?.rating) {
        setFoundFromData(true);
        ratingArray.push(event?.data?.rating);
      }
      if (event?.uid === uid && event?.journey?.id === journey?.id) {
        setIsRated(true);
        setResponseMessage("");
      }
      if (ratingArray.length >= 1 && event?.journey?.id === journey?.id) {
        const result = average(ratingArray);
        setRatingValue(Math.round(result, 1.0));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLocalStorageFirst = useCallback(() => {
    votedJourneys.forEach(voted => {
      if (voted.journeyId === journey.id && !foundFromData) {
        setIsRated(true);
        setRatingValue(voted.rating);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (votedJourneys.length && !isRated) checkLocalStorageFirst();
    if (data) checkIfRated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  if (loadingData) return "Loading...";
  if (errorData) return `Loading error! ${error.message}`;

  return (
    <>
      <Typography component="h5" variant="h5" className={classes.subtitle}>
        {t("Rate the journey")}
      </Typography>
      <Paper className={classes.paper} elevation={0}>
        <Card elevation={1}>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={classes.form}
              name="rateform"
            >
              <Box className={classes.box}>
                <Typography
                  style={{ textAlign: "center" }}
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  {journey?.name}
                </Typography>
                {!responseMessage && (
                  <Rating
                    name="simple-controlled"
                    style={{ fontSize: "2.5rem" }}
                    value={ratingValue}
                    readOnly={isRated ? true : false}
                    onChange={(event, newValue) => {
                      setRatingValue(newValue);
                    }}
                  />
                )}
                {responseMessage && (
                  <Typography
                    style={{ marginTop: "15px" }}
                    gutterBottom
                    variant="h5"
                    component="h5"
                  >
                    {responseMessage}
                  </Typography>
                )}
                {!isRated && !responseMessage && (
                  <Button
                    className={classes.nextPlaceButton}
                    variant="contained"
                    color="primary"
                    type="submit"
                    title={journey?.name}
                  >
                    {t("Submit")}
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};
