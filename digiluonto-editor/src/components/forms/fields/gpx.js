import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardActions from "@mui/material/CardActions";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import DirectionsIcon from "@mui/icons-material/Directions";

import { UPDATE_JOURNEY_MUTATION } from "../../../hooks/journeys";
import {
  UPLOAD_FILE_MUTATION,
  DELETE_FILE_MUTATION,
} from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

FieldGpxRoute.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  activePoi: PropTypes.object.isRequired,
  showHelp: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  setSnackBarData: PropTypes.func.isRequired,
};

export default function FieldGpxRoute({
  title,
  description,
  activePoi,
  setValue,
  showHelp,
  setSnackBarData,
}) {
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION);
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  const [gpx, setGpx] = useState(activePoi?.gpx);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    setGpx(result?.data?.upload);
    setValue("gpx", result?.data?.upload?.id, { shouldDirty: true });
  };

  useEffect(() => {
    if (activePoi?.gpx) {
      setGpx(activePoi.gpx);
      setValue("gpx", activePoi.gpx.id);
    } else {
      setGpx(null);
      setValue("gpx", null);
    }
  }, [activePoi, setValue]);

  const onDelete = async () => {
    // delete from place
    if (activePoi?.__typename === "Place") {
      try {
        await updateJourney({
          variables: {
            input: {
              where: { id: activePoi?.id },
              data: {
                gpx: null,
              },
            },
          },
          refetchQueries: ["MyJourney"],
        });
      } catch {
        setSnackBarData({
          type: "error",
          message: "Tiedoston poistaminen polusta epäonnistui"
        });
      }
    }
    // file
    try {
      await deleteFile({
        variables: {
          input: { where: { id: gpx?.id } },
        },
      });
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Tiedoston poistaminen epäonnistui",
      });
    }
    setGpx(null);
    setValue("gpx", null);
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

      <FormControl fullWidth={true} sx={{ pb: 4 }} disabled={!!gpx}>
        <Card>
          {gpx?.url ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "#f0f3f4",
                height: "64px",
              }}
            >
              <Link
                href={`${GRAPHQL_API}${gpx.url}`}
                target="_blank"
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DirectionsIcon sx={{ fontSize: "48px", color: " #dedede" }} />
                {gpx?.name} ({gpx?.url})
              </Link>
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
              htmlFor="gpx-input"
            >
              <NotListedLocationIcon
                sx={{ fontSize: "48px", color: " #dedede" }}
              />
            </Box>
          )}

          <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
            <IconButton
              disabled={!gpx}
              aria-label="Poista GPX-reittitiedosto"
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>

            <label htmlFor="gpx-input">
              <Input
                inputProps={{ accept: ".gpx" }}
                type="file"
                name="files"
                id="gpx-input"
                onChange={onChange}
                sx={{ display: "none" }}
              />
              <IconButton
                disabled={!!gpx}
                color="primary"
                aria-label="Lataa GPX-reittitiedosto"
                component="span"
              >
                <UploadFileIcon />
              </IconButton>
            </label>
          </CardActions>
        </Card>
      </FormControl>
    </>
  );
}
