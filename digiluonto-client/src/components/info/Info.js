import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation, Trans } from "react-i18next";

import { useGroup } from "../group/GroupContext";
import { JourneyCardGroupLogo } from "../cards/JourneyCardGroupLogo";
import { useLocation } from "../location/LocationContext";
import { LocationDialog } from "../location/LocationDialog";
import { ExternalContent } from "../slider/content/types/ExternalContent";

// import Instagram from "./Instagram";

import {
  Grid,
  Card,
  Paper,
  IconButton,
  Button,
  CardMedia,
  makeStyles,
  Typography,
  CardActions,
  CardContent,
  CardActionArea,
} from "@material-ui/core/";

import {
  Warning as WarningIcon,
  RateReview as FeedbackIcon,
  DirectionsWalk as DirectionsWalkIcon,
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  cards: {
    padding: 12,
    backgroundColor: "#fafafa",
  },
  emergency: {
    display: "flex",
  },
  feedback: {
    display: "flex",
    curson: "pointer",
    textDecoration: "none !important",
  },
  markdownContent: {
    "& img": {
      maxWidth: "100%",
    },
  },
  emergencyIcon: {
    flex: "0 0 50px",
  },
  emergencyText: {
    flex: "0 1 auto",
    paddingTop: theme.spacing(1),
  },
  homepage: {
    textDecoration: "none",
    color: "#222222",
    display: "block",
    textAlign: "right",
    marginTop: theme.spacing(1),
  },
  groupImage: {
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background:
        "linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.2))",
    },
  },
  descriptionLink: {
    "& a": {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
  },
}));

export const Info = () => {
  const classes = useStyles();
  const group = useGroup();

  return (
    <>
      <LocationDialog />

      <div style={{ overflowY: "auto" }}>
        <div className={classes.cards}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <GroupCard />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {/* <Instagram /> */}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <EmergencyInfo />
            </Grid>
            {group.name === "Digiluonto" && (
              <>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <FeedbackInfo />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ContactUs />
                </Grid>
              </>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

const EmergencyInfo = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { location } = useLocation();

  const lat = parseFloat(location?.[0]).toFixed(4);
  const lng = parseFloat(location?.[1]).toFixed(4);

  return (
    <Paper className={classes.emergency} elevation={1}
      data-cy='content-card-emergency'
    >
      <IconButton className={classes.emergencyIcon}>
        <WarningIcon style={{ fontSize: 40 }} />
      </IconButton>

      <div className={classes.emergencyText}>
        <Typography component="p">
          <Trans>In Case of Emergency Call</Trans> <strong>112</strong>
        </Typography>
        <Typography component="p">
          {Array.isArray(location) &&
            `${t("Your GPS location")} lat. ${lat}, lng. ${lng}`}
        </Typography>
      </div>
    </Paper>
  );
};

const ContactUs = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const openLink = () => {
    window.open(
      `${process.env.REACT_APP_PROJECT_HOMEPAGE}/yhteystiedot/`,
      "_blank"
    );
  };

  return (
    <Paper
      className={classes.feedback}
      elevation={1}
      onClick={() => {
        openLink();
      }}
    >
      <IconButton className={classes.emergencyIcon}>
        <DirectionsWalkIcon style={{ fontSize: 40 }} />
      </IconButton>

      <div className={classes.emergencyText}>
        {t("Want to add your own journey in service? Contact us!")}
      </div>
    </Paper>
  );
};

const GroupCard = () => {
  const classes = useStyles();
  const group = useGroup();
  const { t } = useTranslation();

  return (
    <Card
      data-cy="content-card-group"
    >
      <CardActionArea style={{ cursor: "default" }}>
        <div className={classes.groupImage}>
          <JourneyCardGroupLogo group={group} />
          <CardMedia
            component="img"
            height="140"
            style={{ minHeight: 265 }}
            image={`${process.env.REACT_APP_STRAPI}${
              group?.cover?.formats?.medium?.url || group?.cover?.url
            }`}
            alt={group?.name}
          />
        </div>
        <CardContent className={classes.markdownContent}>
          <Typography gutterBottom variant="h5" component="div"
            data-cy="content-group-name"
          >
            {group?.name}
          </Typography>

          <ReactMarkdown
            className={classes.descriptionLink}
            allowedElements={[
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "b",
              "strong",
              "em",
              "italic",
              "u",
              "text",
              "p",
              "a",
              "span",
              "iframe",
              "img",
              "li",
              "ul",
              "ol",
              "blockquote",
            ]}
            linkTarget="_blank"
          >
            {group?.description}
          </ReactMarkdown>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ justifyContent: "space-between" }}>
        <Button
          data-cy="btn-group-share"
          size="small"
          color="primary"
          onClick={() => {
            window.open(
              `${process.env.REACT_APP_ENDPOINT}/?oid=${group.id}`,
              "_blank"
            );
          }}
        >
          {t("Link to share")}
        </Button>
        <Button
          data-cy="btn-group-homepage"
          size="small"
          color="primary"
          onClick={() => {
            window.open(`${group?.homepageUrl}`, "_blank");
          }}
        >
          {group?.homepageTitle}
        </Button>
      </CardActions>
    </Card>
  );
};

const FeedbackInfo = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const link = {
    url: "https://docs.google.com/forms/d/e/1FAIpQLScfv05CVjTxSjfZn-MQ5NvmaqCuL4KEXGlFkdKjVd8otYYQtg/viewform ",
  };

  return (
    <>
      <Paper
        className={classes.feedback}
        elevation={1}
        onClick={() => setOpen(true)}
      >
        <IconButton className={classes.emergencyIcon}>
          <FeedbackIcon style={{ fontSize: 40 }} />
        </IconButton>

        <div className={classes.emergencyText}>
          {t("Leave us some feedback")}
        </div>
      </Paper>
      <div style={{ display: "none" }}>
        <ExternalContent open={open} setOpen={setOpen} link={link} />
      </div>
    </>
  );
};
