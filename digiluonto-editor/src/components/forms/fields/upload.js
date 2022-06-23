import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gql, useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardActions from "@mui/material/CardActions";

import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";
import { UPDATE_JOURNEY_MUTATION } from "../../../hooks/journeys";
import {
  UPLOAD_FILE_MUTATION,
  DELETE_FILE_MUTATION,
} from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

// FieldUpload.propTypes = {
//   description: PropTypes.string,
//   title: PropTypes.string,
//   activePoi: PropTypes.object,
//   setImage: PropTypes.func,
//   image: propTypes.object,
//   setSnackBarData: PropTypes.func.isRequired,
// };

export default function FieldImageUpload({
  setValue,
  description,
  title,
  activePoi,
  showHelp,
  setSnackBarData,
}) {
  const [image, setImage] = useState(null);
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION);

  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  useEffect(() => {
    if (activePoi?.cover) {
      setImage(activePoi.cover);
      setValue("cover", activePoi.cover.id);
    } else {
      setImage(null);
      setValue("cover", null);
    }
  }, [activePoi, setImage, setValue]);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    setImage(result?.data?.upload);
    setValue("cover", result?.data?.upload?.id, { shouldDirty: true });
  };

  const onDelete = async () => {
    // store the id just in case it disappears in middle of delete/refetch
    const coverId = activePoi?.cover?.id;
    // delete from place
    if (activePoi?.__typename === "Place") {
      try {
        await updatePlace({
          variables: {
            input: {
              where: { id: activePoi?.id },
              data: {
                cover: null,
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
                cover: null,
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
    try {
      await deleteFile({
        variables: {
          input: { where: { id: coverId } },
        },
      });
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Tiedoston poistaminen epäonnistui",
      });
    }
    setImage(null);
  };

  function resolveUrl(image) {
    const url = image?.formats?.medium?.url || image?.url || null;
    return `${GRAPHQL_API}${url}`;
  }

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

      <FormControl fullWidth={true} sx={{ pb: 4 }} disabled={!!image}>
        <Card>
          {image ? (
            <CardMedia
              component="img"
              image={resolveUrl(image)}
              alt="Kohteen kuva"
              sx={{ objectFit: "cover", width: "100%", aspectRatio: "16/9" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16/9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
              }}
              htmlFor="image-input"
            >
              <NoPhotographyIcon
                sx={{ fontSize: "100px", color: " #dedede" }}
              />
            </Box>
          )}

          <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
            <IconButton
              disabled={!image}
              aria-label="Poista kuva"
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>

            <label htmlFor="image-input">
              <Input
                inputProps={{ accept: "image/*" }}
                id="image-input"
                type="file"
                name="files"
                onChange={onChange}
                sx={{ display: "none" }}
              />
              <IconButton
                disabled={!!image}
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </CardActions>
        </Card>
      </FormControl>
    </>
  );
}
