import React from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@material-ui/lab/";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Grid, Paper, makeStyles, Typography } from "@material-ui/core/";

import { HELP_QUERY } from "../../gql/queries/Help";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export const Help = () => {
  const classes = useStyles();
  const { i18n } = useTranslation();

  const { loading, error, data } = useQuery(HELP_QUERY, {
    variables: {
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <Loading />;
  if (error) return <p>Error! ${error.message}`</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs>
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="h4">{data.help?.title}</Typography>

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
                "blockquote",
              ]}
              linkTarget="_blank"
            >
              {data.help?.content}
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
              {t("Help")}
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
