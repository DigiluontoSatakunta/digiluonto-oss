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

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import LinearProgress from "@mui/material/LinearProgress";
import { useMutation } from "@apollo/client";
import { QUIZ_QUERY } from "../../../gql/queries/Events";
import { SENDEVENT } from "../../../gql/mutations/Event";
import { useQuery } from "@apollo/client";
import { useGroup } from "../../group/GroupContext";
import { useSettings } from "../../settings/SettingsContext";
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
  answerButton: {
    color: theme.palette.icon.main,
    marginTop: 15,
  },
}));

export const QuestionCard = ({
  place,
  activeJourney,
  setIsAnswered,
  isAnswered,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [answeredPlaces, setAnsweredPlaces] = useState([]);
  //const [isAnswered, setIsAnswered] = useState(false);
  const [foundFromData, setFoundFromData] = useState(false);
  const [finalPoints, setFinalPoints] = useState([]);
  const quizPlaces = JSON.parse(localStorage.getItem("quizPlaces") || "[]");

  const group = useGroup();
  const settings = useSettings();
  const uid = localStorage.getItem("uid");
  const { handleSubmit } = useForm();

  const { data, loadingData, errorData } = useQuery(QUIZ_QUERY, {
    fetchPolicy: "network-only",
  });
  const message = t("Yes");
  const [sendEvent, { loading, error }] = useMutation(SENDEVENT, {
    onCompleted(response) {
      if (response?.createEvent?.event?.id) {
        setFeedBack(message);
        setIsAnswered(true);
      }
    },
  });

  const questionPlaces = activeJourney.places.filter(
    place => place.questions.length
  );

  const handleEvent = useCallback(
    eventValue => {
      setIsAnswered(true);
      const userAgent = navigator.userAgent;
      if (!crawlers.includes(userAgent) && group && !settings?.debug) {
        sendEvent({
          variables: {
            input: {
              data: {
                type: "answer",
                data: eventValue,
                place: place.id,
                group: group.id,
                journey: activeJourney.id,
                uid: uid,
              },
            },
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsAnswered]
  );

  const onSubmit = () => {
    try {
      quizPlaces.push({
        placeId: place.id,
        answer: value,
        correctAnswer: correctAnswer,
      });
      localStorage.setItem("quizPlaces", JSON.stringify(quizPlaces));
    } catch {
      console.log("catcherror");
    }

    place?.questions[0].answers.forEach(answer => {
      if (value === answer.answer && answer.correctAnswer) {
        handleEvent(1);
        setFeedBack("Correct!");
      }
      if (value === answer.answer && !answer.correctAnswer) {
        handleEvent(0);
        setFeedBack("");
      }
    });
  };
  const handleChange = event => {
    setValue(event.target.value);
    if (
      place?.questions[0].answers.find(
        answer => answer.answer === event.target.value && answer.correctAnswer
      )
    ) {
      setCorrectAnswer(true);
    }
  };

  const checkIfAnswered = useCallback(() => {
    data?.events?.forEach(event => {
      if (event?.place?.id === place?.id && event?.data?.answer) {
        setFoundFromData(true);
        setValue(event.data.answer);
      }
      if (event?.uid === uid && event?.place?.id === place?.id) {
        setIsAnswered(true);
        setFeedBack("jee");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLocalStorageFirst = useCallback(() => {
    quizPlaces.forEach(answered => {
      if (answered.placeId === place.id && !foundFromData) {
        setIsAnswered(true);
        setValue(answered.answer);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizPlaces]);

  const chechAnsweredPlaces = useCallback(() => {
    quizPlaces.forEach(answered => {
      if (
        activeJourney.places.find(
          journeyPlace => journeyPlace.id === place.id
        ) &&
        !answeredPlaces.find(id => id === answered.placeId)
      ) {
        setAnsweredPlaces([...answeredPlaces, answered.placeId]);
      }
      if (
        answeredPlaces.length === questionPlaces?.length &&
        activeJourney.places.find(place => place.id === answered.placeId)
      ) {
        if (answered.correctAnswer && !finalPoints.includes(answered.placeId)) {
          setFinalPoints([...finalPoints, answered.placeId]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredPlaces, quizPlaces, finalPoints]);

  useEffect(() => {
    if (isAnswered) chechAnsweredPlaces();
  }, [isAnswered, chechAnsweredPlaces]);

  useEffect(() => {
    if (quizPlaces.length) checkLocalStorageFirst();
    if (data?.length) checkIfAnswered();
  }, [data, quizPlaces, checkLocalStorageFirst, checkIfAnswered]);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  if (loadingData) return "Loading...";
  if (errorData) return `Loading error! ${error.message}`;

  return (
    <>
      <Typography component="h5" variant="h5" className={classes.subtitle}>
        {place?.questions[0]?.question}
      </Typography>
      <Paper className={classes.paper} elevation={0}>
        <Card elevation={1}>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={classes.form}
              name="answerform"
            >
              <div className={classes.checkBoxContainer}>
                <FormControl style={{ width: "100%" }}>
                  <RadioGroup
                    aria-label="templates"
                    name="templates"
                    value={value}
                    onChange={handleChange}
                  >
                    {isAnswered ? (
                      <Answer
                        disabled={isAnswered ? true : false}
                        answers={place?.questions[0]?.answers}
                      />
                    ) : feedBack ? (
                      <Answer answers={place?.questions[0]?.answers} />
                    ) : (
                      <Answer answers={place?.questions[0]?.answers} />
                    )}
                  </RadioGroup>
                  {finalPoints.length ? (
                    <Typography style={{ marginTop: 10 }}>
                      {t("Awesome! You completed all the questions!")}
                    </Typography>
                  ) : isAnswered || feedBack ? (
                    <Typography style={{ marginTop: 10 }}>
                      {place?.questions[0]?.explanation}
                    </Typography>
                  ) : null}
                  {(isAnswered || feedBack) && (
                    <>
                      <Box sx={{ width: "100%", mr: 1, marginTop: 20 }}>
                        {finalPoints.length ? (
                          <LinearProgress
                            variant="determinate"
                            color="primary"
                            value={
                              (finalPoints?.length / questionPlaces?.length) *
                              100
                            }
                            classes={{
                              root: classes.progressBar,
                            }}
                          />
                        ) : (
                          <LinearProgress
                            variant="determinate"
                            color="primary"
                            value={
                              (answeredPlaces?.length /
                                questionPlaces?.length) *
                              100
                            }
                            classes={{
                              root: classes.progressBar,
                            }}
                          />
                        )}
                      </Box>
                      {finalPoints.length ? (
                        <Box sx={{ minWidth: 35, marginBottom: "10px" }}>
                          <Typography
                            style={{ textAlign: "center", marginTop: "10px" }}
                          >
                            {t("Scores")} {finalPoints?.length} /{" "}
                            {questionPlaces?.length}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ minWidth: 35, marginBottom: "10px" }}>
                          <Typography
                            style={{ textAlign: "center", marginTop: "10px" }}
                          >
                            {t("Answered")} {answeredPlaces?.length} /{" "}
                            {questionPlaces?.length}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                  {isAnswered ? null : feedBack ? null : (
                    <Button
                      variant="contained"
                      color="primary"
                      aria-label="check answer"
                      type="submit"
                      className={classes.answerButton}
                    >
                      {t("Check")}
                    </Button>
                  )}
                </FormControl>
              </div>
            </form>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

const Answer = ({ answers, disabled }) => {
  return !answers
    ? null
    : answers?.map(answer => {
        return (
          <FormControlLabel
            key={answer.id}
            disabled={disabled}
            value={answer.answer}
            control={<Radio />}
            label={answer.answer}
            //classes={{ root: classes.radioButtons }}
          />
        );
      });
};
