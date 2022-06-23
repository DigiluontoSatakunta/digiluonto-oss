import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardActions from "@mui/material/CardActions";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

import FieldArImageUpload from "./arBackground";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";
import {
  UPLOAD_FILE_MUTATION,
  DELETE_FILE_MUTATION,
} from "../../../hooks/files";
import { GRAPHQL_API } from "../../../utility/definitions";

FieldAR.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  help: PropTypes.string.isRequired,
  activePoi: PropTypes.object.isRequired,
  showHelp: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  setSnackBarData: PropTypes.func.isRequired,
};

export default function FieldAR({
  setValue,
  description,
  help,
  title,
  activePoi,
  showHelp,
  setSnackBarData,
}) {
  const [ar, setAr] = useState(null);
  const [showAddAr, setShowAddAr] = useState(false);
  const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION);

  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);

  useEffect(() => {
    if (activePoi?.ar) {
      setAr(activePoi.ar);
      // TODO setValue is probably not really needed, though it depends on many thing
      setValue("ar", activePoi.ar.map(item => ({id: item.id})));
    } else {
      setAr(null);
      setValue("ar", null);
    }
    setShowAddAr(false);
  }, [activePoi, setAr, setShowAddAr, setValue]);

  const onChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile({ variables: { file } });

    if (result?.data?.upload?.id) {
      let newItemArray = ar // filter first for any null modelFiles, then map for correct format
        // a null modelFile might occur in case the AR-file was associated with multiple places, and one is removed
        .filter(item => item.modelFile !== null) // actually this *should not* happen, but check just in case...
        .map((item) => ({ id: item.id })); // collect old items (AR.id)
      newItemArray.push({ modelFile: result.data.upload.id}) // push new item as modelFile (modelFile.id)
      updatePlaceAR(newItemArray); // update AR on place, refetch will trigger state update
    }
  };

  const onDelete = (item) => {
    if (item && ar) {
      deleteItem(item);
    }
  }

  const deleteItem = async (item) => {
    // item to be deleted will be removed from array
    const deletedItemArray = ar.filter(j => j !== item).map(({id}) => ({ id }));

    // delete from place
    updatePlaceAR(deletedItemArray);
    // file
    if (item?.modelFile?.id) {
      deleteFileById(item?.modelFile.id);
    }
    if (item?.background?.id) {
      deleteFileById(item?.background.id);
    }
  };

  const deleteFileById = async (fileId) => {
    try {
      await deleteFile({
        variables: {
          input: { where: { id: fileId } },
        },
      });
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Tiedoston poistaminen epäonnistui",
      });
    }
  }

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

      {ar?.map(item => (
        <FormControl key={item.id} fullWidth={true} sx={{ mb: 4 }} disabled>
          <Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "#f0f3f4",
                height: "64px",
              }}
            >
              { item.modelFile ? (
              <Link
                href={`${GRAPHQL_API}${item.modelFile.url}`}
                target="_blank"
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ViewInArIcon sx={{ fontSize: "48px", color: " #dedede" }} />
                {item.modelFile.name} ({item.modelFile.url})
              </Link>
              ) : (
                <p>Ongelma: Liitetty 3D-mallitiedosto on poistunut. Klikkaa poista painiketta.</p>
              )}
            </Box>
            <MyCardActions onChange={onChange} onDelete={onDelete} item={item} />
            <FieldArImageUpload
              activePoi={activePoi}
              arItem={item}
              showHelp={showHelp}
              setSnackBarData={setSnackBarData}
              description="Tässä voit halutessasi valita AR-sisällön yhteydessä näytettävän taustakuvan.
                Mikäli et valitse taustakuvaa, käytetään sen sijaan kamerasta saatavaa kuvaa."
            />
          </Card>
        </FormControl>
      ))}

      {showAddAr ? (
        <>
          {showHelp && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {help}
            </Typography>
          )}
          <FormControl fullWidth={true} sx={{ pb: 4 }}>
            <Card>
              <Box
                sx={{
                  width: "100%",
                  height: "64px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f0f3f4",
                }}
              >
                <AddIcon
                  sx={{ fontSize: "32px", color: " #dedede" }}
                />
                <ViewInArIcon
                  sx={{ fontSize: "48px", color: " #dedede" }}
                />
              </Box>
              <MyCardActions onChange={onChange} onDelete={onDelete} item={null} />
            </Card>
          </FormControl>
        </>
      ) : (
        <Button
          onClick={() => setShowAddAr(true)}
          size="medium"
          sx={{ mb: 2 }}
          fullWidth>
          Lisää uusi AR-sisältö
        </Button>
      )}
    </>
  );
}

function MyCardActions({onChange, onDelete, item}) {
  return (
    <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
      <IconButton
        disabled={!item}
        aria-label="Poista AR-tiedosto"
        onClick={() => onDelete(item)}
      >
        <DeleteIcon />
      </IconButton>

      <label htmlFor={`ar-input-${item?.id || "new-ar"}`}>
        <Input
          inputProps={{ accept: ".glb" }}
          id={`ar-input-${item?.id || "new-ar"}`}
          type="file"
          name="files"
          onChange={onChange}
          sx={{ display: "none" }}
        />
        <IconButton
          disabled={!!item}
          color="primary"
          aria-label="Lataa AR-tiedosto"
          component="span"
        >
          <UploadFileIcon />
        </IconButton>
      </label>
    </CardActions>
  )
}
