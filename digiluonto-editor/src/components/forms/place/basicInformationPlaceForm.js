import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import FieldSlider from "../fields/slider";
import FieldImageUpload from "../fields/upload";
import FieldDescription from "../fields/description";
import FieldLocationPicker from "../fields/location";
import FieldSubmitController from "../fields/submit";

import { useUser } from "../../../hooks/user";

import {
  CREATE_PLACE_MUTATION,
  UPDATE_PLACE_MUTATION,
} from "../../../hooks/places";

export default function BasicInformationPlaceForm({
  activePoi,
  setActivePoi,
  setMarkerEditMode,
  markerEditMode,
  handleFormCancel,
  isDrawerOpen,
  setIsDrawerOpen,
  setSnackBarData,
  showHelp,
}) {
  const { user } = useUser();

  const [activeMarker, setActiveMarker] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      latitude: 0,
      longitude: 0,
      radius: 10,
      cover: null,
    },
  });

  const onSubmit = async data => {
    const result =
      activePoi?.__typename === "Place"
        ? await updatePlaceSubmit(data)
        : await createPlaceSubmit(data);
    setSnackBarData({ type: "success", message: "Tiedot tallennettu!" });
  };

  const [createPlace] = useMutation(CREATE_PLACE_MUTATION);
  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);

  useEffect(() => {
    if (activePoi?.__typename === "Place") {
      // update
      setValue("name", activePoi?.name);
      setValue("description", activePoi?.description);
      setValue("radius", activePoi?.geoJSON?.properties?.radius);
      setValue("latitude", activePoi?.geoJSON?.geometry?.coordinates[1]);
      setValue("longitude", activePoi?.geoJSON?.geometry?.coordinates[0]);
      setValue("cover", activePoi?.cover?.id);

      const [lng, lat] = activePoi?.geoJSON?.geometry?.coordinates;
      setActiveMarker({ lat, lng });
    } else if (activePoi?.__typename === "Marker") {
      // new place
      setValue("radius", activePoi?.geoJSON?.properties?.radius);
      const [lng, lat] = activePoi?.geoJSON?.geometry?.coordinates;
      setActiveMarker({ lat, lng });
    } else {
      // no activePoi
      setValue("name", "", { shouldDirty: true });
      setValue("description", "");
      setActiveMarker(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePoi, setValue]);

  const updatePlaceSubmit = async data => {
    try {
      await updatePlace({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data,
          },
        },
        refetchQueries: ["MyPlaces", "MyPlace"],
      });
      // reset dirty state
      reset(data);
    } catch {
      setSnackBarData({
        type: "error",
        message: "Paikan päivityksessä tapahtui virhe",
      });
    }
  };

  const createPlaceSubmit = async data => {
    try {
      const { data: createData } = await createPlace({
        variables: {
          input: {
            data: {
              ...data,
              ownerGroup: user?.group?.id,
              groups: [user?.group?.id],
            },
          },
        },
        refetchQueries: ["MyPlaces", "MyPlace"],
      });

      if (createData?.createPlace?.place?.id) {
        // set result as activePoi
        setActivePoi(createData?.createPlace?.place);
        // disable marker edit mode
        setMarkerEditMode(false);
        // reset dirty form state
        reset(data);
      }
    } catch {
      setSnackBarData({
        type: "error",
        message: "Paikan tallennuksessa tapahtui virhe",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Paikan nimi ja lyhyt kuvaus
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Anna paikalle kuvaava nimi ja lyhyt kuvaus. Nimi ja kuvaus näkyvät
          paikkojen listauksessa sekä kartalla.
        </Typography>
      )}

      <FormControl
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: true, minLength: 3, maxLength: 100 }}
          render={({ field }) => (
            <TextField
              autoFocus={!activePoi}
              name="name"
              variant="filled"
              size="small"
              label="Nimi"
              error={errors.name ? true : false}
              helperText={
                errors.name
                  ? "Lisääthän kohteelle nimen. Nimen pituus pitää olla 3-100 merkkiä."
                  : null
              }
              {...field}
            />
          )}
        />
      </FormControl>

      <FieldDescription control={control} errors={errors} showHelp={showHelp} />

      <FieldLocationPicker
        setValue={setValue}
        setMarkerEditMode={setMarkerEditMode}
        markerEditMode={markerEditMode}
        setActiveMarker={setActiveMarker}
        activeMarker={activeMarker}
        setActivePoi={setActivePoi}
        activePoi={activePoi}
        showHelp={showHelp}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        title={"Paikan sijainti kartalla"}
        description={
          "Voit valita paikan sijainnin kartalta klikkaamalla kartta ikonia tai \
          käyttämällä omaa sijaintiasi klikkaamalla paikanna ikonia. Valitse myös \
          paikan ympyrän säde, jolla paikka on kartalla aktiivinen. Paikan säteen \
          oletusarvo on 10 metriä."
        }
      />

      {activePoi && (
        <FieldSlider
          control={control}
          setActivePoi={setActivePoi}
          activePoi={activePoi}
          showHelp={showHelp}
        />
      )}

      <FieldImageUpload
        setValue={setValue}
        activePoi={activePoi}
        showHelp={showHelp}
        title={"Paikan kansikuva"}
        description={
          "Valitse paikalle kansikuva. Kansikuva näytetään paikan tiedoissa, \
          paikkalistoissa sekä kartalla paikan pääkuvana."
        }
        setSnackBarData={setSnackBarData}
      />

      <FieldSubmitController
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        handleCancel={handleFormCancel}
      />
    </form>
  );
}
