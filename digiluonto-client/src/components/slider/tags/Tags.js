import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Skeleton } from "@material-ui/lab/";
import {
  Grid,
  Chip,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core/";
import { useGroup } from "../../group/GroupContext";
import { SliderTitle } from "../SliderTitle";

import { TAGS_USED_BY_GROUP } from "../../../gql/queries/Tags";

const useStyles = makeStyles(theme => ({
  sliderGrid: {
    margin: 0,
    flex: "1 0 auto",
    maxWidth: "100%",
    display: "grid",
  },
  mapSliderContent: {
    height: "100%",
    flex: 1,
    zIndex: 5,
    overflow: "hidden !important",
    background: "#fff",
    marginTop: 50,
    [theme.breakpoints.up("md")]: {
      gridArea: "slider",
    },
  },
  listItem: {
    color: "#000000de",
  },
  scelonListItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  placeholder: {
    position: "absolute",
    height: 200,
    zIndex: 2,
    top: -55,
    left: 0,
    right: 0,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  helpText: {
    fontSize: ".8rem",
  },
  helpBox: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: ".86em",
    color: "#737373",
    gap: 8,
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginRight: 4,
  },
}));

export const Tags = ({ setUnCheckedTags, unCheckedTags }) => {
  const classes = useStyles();
  const theme = useTheme();
  const group = useGroup();
  const { t, i18n } = useTranslation();

  const handleToggle = value => () => {
    setUnCheckedTags(prevUnChecked =>
      prevUnChecked.includes(value)
        ? prevUnChecked.filter(id => id !== value)
        : [...prevUnChecked, value]
    );
  };

  const { loading, error, data } = useQuery(TAGS_USED_BY_GROUP, {
    variables: {
      id: group.id,
      sort: "name:asc",
      locale: i18n.language,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <ListSkeleton />;
  if (error)
    return (
      <p>
        {t("Error")}! ${error.message}`
      </p>
    );
  if (!data) return <p>{t("Not found")}</p>;

  const tags = [...new Set(data?.group?.places?.flatMap(place => place?.tags))];

  return (
    <>
      <Helmet>
        <title>
          {t("Filter places")} | {group?.name}
        </title>
        <meta name="description" content={group?.welcome} />
        <body class="map-with-slider-layout" />
      </Helmet>
      {/* <Link to="/map" className={classes.placeholder}></Link> */}
      <SliderTitle
        title={t("Filter places")}
        className={classes.mapSliderTitle}
      />

      <div className={classes.mapSliderContent}>
        <Grid item xs={12} style={{ padding: "4px 8px", height: 24 }}>
          <div className={classes.helpBox}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className={classes.tagDot}
                style={{
                  backgroundColor: theme.palette.secondary.main,
                }}
              ></div>
              <Typography className={classes.helpText}>
                {t("Show tag on map")}
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={classes.tagDot}></div>
              <Typography className={classes.helpText}>
                {t("Hide tag from map")}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ padding: 8, minHeight: "calc(100% - 32px)" }}
        >
          <div className={classes.chips}>
            {tags?.map((tag, i) => (
              <Chip
                style={{ margin: "0 6px 6px 0" }}
                key={i}
                color={
                  !unCheckedTags.includes(tag.id) ? "secondary" : "default"
                }
                label={tag.name}
                onClick={handleToggle(tag.id)}
              />
            ))}
          </div>
        </Grid>
      </div>
    </>
  );
};

function ListSkeleton() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Link to="/map" className={classes.placeholder}></Link>
      <SliderTitle
        title={t("Filter places")}
        className={classes.mapSliderTitle}
      />
      <div className={classes.mapSliderContent}>
        <Grid item xs={12} style={{ padding: 8, minHeight: "100%" }}>
          <div className={classes.chips}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
              <Skeleton
                cariant="circle"
                style={{
                  margin: "0 6px 0 0",
                  display: "inline-block",
                  borderRadius: 17,
                  boxSizing: "border-box",
                }}
                key={i}
                animation="wave"
                width={90}
                height={32}
              />
            ))}
          </div>
        </Grid>
      </div>
    </>
  );
}
