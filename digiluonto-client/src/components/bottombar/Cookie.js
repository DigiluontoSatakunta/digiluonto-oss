import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, Typography } from "@material-ui/core";
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles(theme => ({
  box: {
    width: "100%",
    height: "100px",
    background: "#212121",
    position: "absolute",
    bottom: 0,
    zIndex: "1000",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accept: {
    marginRight: 8,
    top: 0,
    background: "#15850e",
    color: theme.palette.icon.main,
  },
  decline: {
    marginRight: 8,
    top: 0,
    background: "#6e6e6e",
    color: theme.palette.icon.main,
  },
}));

export const Cookie = () => {
  const { t } = useTranslation();
  const date = new Date();
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const cookies = new Cookies();
  const storagedCookies = JSON.parse(localStorage.getItem("cookies"));
  const enableCookies = () => {
    const cookieObject = { allcookies: true, eventTime: date.toDateString() };

    cookies.set("ga", "enabled", {
      path: "/",
      expires: new Date(Date.now() + 31449600),
    });
    localStorage.setItem("cookies", JSON.stringify(cookieObject));
    setOpen(false);
  };
  const enableNeccesseryCookies = () => {
    const cookieObject = { necessery: true, eventTime: date.toDateString() };

    cookies.remove("_ga", { path: "/", domain: ".digiluonto.fi" });
    cookies.remove("_ga_8S3C1DCC7F", { path: "/", domain: ".digiluonto.fi" });
    localStorage.setItem("cookies", JSON.stringify(cookieObject));
    setOpen(false);
  };

  useEffect(() => {
    if (storagedCookies) {
      setOpen(false);
    }
  }, [storagedCookies]);

  return (
    <>
      {open ? (
        <>
          <Box className={classes.box}>
            <Box style={{ marginLeft: 8 }}>
              <Typography
                component="h5"
                variant="h5"
                style={{
                  color: "white",
                  fontSize: "1.3rem",
                  top: "10px",
                  left: "20px",
                }}
              >
                {t("We use cookies")}
              </Typography>

              <Link to="/privacy-policy">
                <Typography
                  style={{
                    color: "white",
                    textDecoration: "none",
                    bottom: "20px",
                    left: "20px",
                  }}
                >
                  {t("Read more")}
                </Typography>
              </Link>
            </Box>

            <Box style={{ display: "flex", marginLeft: 8 }}>
              <Button
                onClick={enableNeccesseryCookies}
                className={classes.decline}
              >
                {t("Only necessary")}
              </Button>
              <Button onClick={enableCookies} className={classes.accept}>
                {t("Accept")}
              </Button>
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );
};
