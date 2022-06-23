import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SENDMESSAGE } from "../../gql/mutations/Message";

import {
  Container,
  TextField,
  CssBaseline,
  Button,
  Typography,
  makeStyles,
  FormControl,
} from "@material-ui/core";

const { detect } = require("detect-browser");

const useStyles = makeStyles(theme => ({
  root: {
    flex: "1 0 auto",
    margin: 0,
    minWidth: "100%",
    padding: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  field: {
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderRadius: 4,
  },
}));

export const FeedbackForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [responseMessage, setResponseMessage] = useState("");

  // https://react-hook-form.com/get-started
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [sendMessage, { response, loading, error }] = useMutation(SENDMESSAGE, {
    onCompleted(response) {
      if (response?.createMessage?.message?.id) {
        setResponseMessage(t("Thank you for your feedback!"));
      }
    },
  });

  const onSubmit = data => {
    const browser = detect();
    const { os, version, name } = browser;

    sendMessage({
      variables: {
        input: {
          data: {
            subject: data.subject,
            message: data.message,
            os,
            browser: `${name} - ${version}`,
            url: window.location.href,
          },
        },
      },
    });
  };

  // nämä käyttöliittymään elementtiin näkyviin esim otsikon alle
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  // tekstikenttien tyhjennys kun lähetys ok

  return (
    <Container component="div" className={classes.root} maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {t("Send Feedback")} {response?.id}
        </Typography>
        {responseMessage ? (
          <p>{responseMessage}</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            name="feedbackForm"
          >
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <TextField
                className={classes.field}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="subject"
                label={t("Subject")}
                {...register("subject")}
                helperText={errors.subject && t("This field is required")}
              />
            </FormControl>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <TextField
                className={classes.field}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="message"
                label={t("Message")}
                multiline
                rows={4}
                {...register("message")}
                helperText={errors.message && "This field is required"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t("Submit")}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
};
