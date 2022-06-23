import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import {
  UPLOAD_FILE_MUTATION,
  DELETE_FILE_MUTATION,
} from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

FieldArImageUpload.propTypes = {
  description: PropTypes.string.isRequired,
  activePoi: PropTypes.object.isRequired,
  arItem: PropTypes.object.isRequired,
  showHelp: PropTypes.bool,
  setSnackBarData: PropTypes.func.isRequired,
};

export default function FieldArImageUpload({
  description,
  activePoi,
  arItem,
  showHelp,
  setSnackBarData,
}) {
  const [image, setImage] = useState(null);
  const [showAddImage, setShowAddImage] = useState(false);
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION);

  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);

  useEffect(() => {
    if (arItem?.background) {
      setImage(arItem.background);
    } else {
      setImage(null);
    }
    setShowAddImage(false);
  }, [arItem, setImage, setShowAddImage]);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    if (result?.data?.upload?.id) {
      let updatedItemArray = activePoi.ar.map(ar => ar?.id === arItem.id ? {
          id: ar.id,
          modelFile: ar.modelFile.id,
          background: result?.data?.upload?.id,
        } : {
          id: ar.id,
        });
      updatePlaceAR(updatedItemArray); // update AR on place, refetch will trigger state update
    }
  };

  const onDelete = async () => {
    // store the id just in case it disappears in middle of delete/refetch
    const uploadId = image?.id;
    if (uploadId === undefined) {
      return;
    }
    let arItems = activePoi.ar.map(ar => ar.id === arItem.id
      ? {id: ar.id, modelFile: ar.modelFile.id, background: null} : {id: ar.id});
    // delete from place.ar
    updatePlaceAR(arItems);
    // file
    try {
      await deleteFile({
        variables: {
          input: { where: { id: uploadId } },
        },
      });
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Tiedoston poistaminen epäonnistui",
      });
    }
  };

  const updatePlaceAR = async (arItems) => {
    try {
      await updatePlace({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data: {
              ar: arItems,
            },
          },
        },
        refetchQueries: ["MyPlace"],
      });
    } catch {
      setSnackBarData({
        type: "error",
        message: "Paikan AR-sisällön päivitys epäonnistui",
      });
    }
  }

  function resolveUrl(image) {
    const url = image?.formats?.medium?.url || image?.url || null;
    return `${GRAPHQL_API}${url}`;
  }

  return (
    <>
      {!(image || showAddImage) && (
        <>
          {showHelp && (
            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              {description}
            </Typography>
          )}
          <Button
            onClick={() => setShowAddImage(true)}
            size="medium"
            sx={{ mb: 2 }}
            fullWidth>
            Liitä taustakuva
          </Button>
        </>
      )}
      <FormControl fullWidth={true} disabled={!!image}>
        <Card hidden={!(image || showAddImage)}>
          {image ? (
            <CardMedia
              component="img"
              image={resolveUrl(image)}
              alt="AR-sisällön taustakuva"
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

            <label htmlFor={`ar-image-input-${arItem?.id}`}>
              <Input
                inputProps={{ accept: "image/*" }}
                id={`ar-image-input-${arItem?.id}`}
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
