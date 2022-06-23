import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import "./ArCamera.css";
import "@google/model-viewer";
import { useQuery } from "@apollo/client";
import { PLACEBYID } from "../../gql/queries/Places";
const useStyles = makeStyles(theme => ({
  Ar: {
    height: "100%",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    width: "80px",
    height: "40px",
    bottom: "20px",
    left: "20px",
    zIndex: "100",
    background: theme.palette.primary.main,
    color: theme.palette.icon.main,
  },
}));

export const ArCamera = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { loading, error, data } = useQuery(PLACEBYID, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        {"Error"}! ${error.message}`
      </p>
    );
  const goBack = () => {
    history.push(`/places/${id}`);
  };
  return data?.place.ar.length === 0
    ? null
    : data?.place.ar.map((ar, i) => {
        return (
          <>
            {ar?.background ? (
              <div className={classes.Ar}>
                <model-viewer
                  key={i}
                  autoplay
                  ar
                  shadow-intensity="1"
                  id="model-viewer"
                  src={`${process.env.REACT_APP_STRAPI}${ar.modelFile.url}`}
                  skybox-image={`${process.env.REACT_APP_STRAPI}${ar?.background?.url}`}
                  ar-modes="scene-viewer webxr"
                  camera-controls
                ></model-viewer>
                <Button onClick={goBack} className={classes.backButton}>
                  Takaisin
                </Button>
              </div>
            ) : (
              <div className={classes.Ar}>
                <model-viewer
                  key={i}
                  autoplay
                  ar
                  shadow-intensity="1"
                  id="model-viewer"
                  src={`${process.env.REACT_APP_STRAPI}${ar.modelFile.url}`}
                  ar-modes="scene-viewer webxr"
                  camera-controls
                ></model-viewer>
                <Button onClick={goBack} className={classes.backButton}>
                  Takaisin
                </Button>
              </div>
            )}
          </>
        );
      });
};
