import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardActions from "@mui/material/CardActions";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import HeadsetOffIcon from "@mui/icons-material/HeadsetOff";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";
import { UPDATE_JOURNEY_MUTATION } from "../../../hooks/journeys";
import {
  UPLOAD_FILE_MUTATION,
  DELETE_FILE_MUTATION,
} from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

FieldAudioGuide.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  activePoi: PropTypes.object.isRequired,
  showHelp: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  setSnackBarData: PropTypes.func.isRequired,
};

export default function FieldAudioGuide({
  title,
  description,
  activePoi,
  setValue,
  showHelp,
  setSnackBarData,
}) {
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION);
  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  const [audioGuide, setAudioGuide] = useState(activePoi?.audioGuide);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    setAudioGuide(result?.data?.upload);
    setValue("audioGuide", result?.data?.upload?.id, { shouldDirty: true });
  };

  useEffect(() => {
    if (activePoi?.audioGuide) {
      setAudioGuide(activePoi.audioGuide);
      setValue("audioGuide", activePoi.audioGuide.id);
    } else {
      setAudioGuide(null);
      setValue("audioGuide", null);
    }
  }, [activePoi, setValue]);

  const onDelete = async () => {
    // delete from place
    if (activePoi?.__typename === "Place") {
      try {
        await updatePlace({
          variables: {
            input: {
              where: { id: activePoi.id },
              data: {
                audioGuide: null,
              },
            },
          },
          refetchQueries: ["MyPlace"],
        });
      } catch {
        setSnackBarData({
          type: "error",
          message: "Tiedoston poistaminen paikasta epäonnistui",
        });
      }
    }
    // delete from journey
    if (activePoi?.__typename === "Journey") {
      try {
        await updateJourney({
          variables: {
            input: {
              where: { id: activePoi?.id },
              data: {
                audioGuide: null,
              },
            },
          },
          refetchQueries: ["MyJourney"],
        });
      } catch {
        setSnackBarData({
          type: "error",
          message: "Tiedoston poistaminen polusta epäonnistui",
        });
      }
    }
    // file
    if (activePoi?.audioGuide?.id) {
      try {
        await deleteFile({
          variables: {
            input: { where: { id: activePoi.audioGuide.id } },
          },
        });
      } catch (e) {
        setSnackBarData({
          type: "error",
          message: "Tiedoston poistaminen epäonnistui",
        });
      }
    }
    setAudioGuide(null);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <FormControl fullWidth={true} sx={{ pb: 4 }} disabled={!!audioGuide}>
        <Card>
          {audioGuide?.url ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "#f0f3f4",
                height: "64px",
              }}
            >
              <audio controls style={{ minWidth: "100%" }}>
                <source
                  type="audio/mpeg"
                  src={`${GRAPHQL_API}${audioGuide?.url}`}
                />
              </audio>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "64px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f0f3f4",
              }}
              htmlFor="audio-input"
            >
              <HeadsetOffIcon sx={{ fontSize: "48px", color: " #dedede" }} />
            </Box>
          )}

          <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
            <IconButton
              disabled={!audioGuide}
              aria-label="Poista ääniopas"
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>

            <label htmlFor="audio-input">
              <Input
                inputProps={{ accept: "audio/mp3" }}
                type="file"
                name="files"
                id="audio-input"
                onChange={onChange}
                sx={{ display: "none" }}
              />
              <IconButton
                disabled={!!audioGuide}
                color="primary"
                aria-label="Lataa ääniopas"
                component="span"
              >
                <HeadphonesIcon />
              </IconButton>
            </label>
          </CardActions>
        </Card>
      </FormControl>
    </>
  );
}
