import React from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@material-ui/lab/";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Grid, Paper, makeStyles, Typography } from "@material-ui/core/";

import { PRIVACY_POLICY_QUERY } from "../../gql/queries/PrivacyPolicy";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

export const PrivacyPolicy = () => {
  const classes = useStyles();
  const { i18n } = useTranslation();

  const { loading, error, data } = useQuery(PRIVACY_POLICY_QUERY, {
    variables: {
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <Loading />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div
      className={classes.root}
      style={{ overflowY: "auto" }}
    >
      <Grid container>
        <Grid item xs>
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="h4">{data.privacyPolicy?.title}</Typography>

            <ReactMarkdown
              allowedElements={[
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "strong",
                "em",
                "u",
                "p",
                "a",
                "li",
                "ul",
                "hr",
                "br",
                "blockquote",
              ]}
              linkTarget="_blank"
            >
              {data.privacyPolicy?.content}
            </ReactMarkdown>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const Loading = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs>
          <Paper className={classes.paper} elevation={0}>
            <Typography className={classes.title} variant="h4">
              {t("Privacy Policy")}
            </Typography>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
