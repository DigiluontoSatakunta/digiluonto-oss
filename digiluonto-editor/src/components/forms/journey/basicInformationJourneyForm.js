import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import { useUser } from "../../../hooks/user";
import { JOURNEY_BASIC, formValueResolver } from "../defaultValues";

import FieldSlider from "../fields/slider";
import FieldImageUpload from "../fields/upload";
import FieldDescription from "../fields/description";
import FieldLocationPicker from "../fields/location";
import FieldSubmitController from "../fields/submit";
import FieldGpxRoute from "../fields/gpx";

import {
  CREATE_JOURNEY_MUTATION,
  UPDATE_JOURNEY_MUTATION,
} from "../../../hooks/journeys";

export default function BasicInformationJourneyForm({
  activePoi, // in fact, it is activeJourney, but POI is useful when copy&pasting
  // POI naming is used when item can be either place or journey
  setActivePoi,
  setMarkerEditMode,
  markerEditMode,
  handleFormCancel,
  isDrawerOpen,
  setIsDrawerOpen,
  showHelp,
  setSnackBarData,
}) {
  const { user } = useUser();

  const [activeMarker, setActiveMarker] = useState(null);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: JOURNEY_BASIC,
  });

  const onSubmit = async data => {
    const result =
      activePoi?.__typename === "Journey"
        ? await updateJourneySubmit(data)
        : await createJourneySubmit(data);
    setSnackBarData({ type: "success", message: "Polun tiedot tallennettu!" });
  };

  const [createJourney] = useMutation(CREATE_JOURNEY_MUTATION);
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  useEffect(() => {
    if (activePoi?.__typename === "Journey") {
      const values = formValueResolver(JOURNEY_BASIC, activePoi, "Journey");
      Object.keys(values.resolvedObjects).forEach(prop => {
        setValue(prop, values.resolvedObjects[prop], { shouldValidate: true });
      });

      // These are handled manually
      setActiveMarker(values.unhandledObjects?.latlng);
    } else if (activePoi?.__typename === "Marker") {
      // new journey
      setValue("radius", activePoi?.geoJSON?.properties?.radius);
      const [lng, lat] = activePoi?.geoJSON?.geometry?.coordinates;
      setActiveMarker({ lat, lng });
    } else {
      // no activePoi
      reset(JOURNEY_BASIC); // clear the form
      setActiveMarker(null);
    }
  }, [activePoi, setValue, setActiveMarker, reset]);

  const updateJourneySubmit = async data => {
    try {
      await updateJourney({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data: {
              ...data,
            },
          },
        },
        refetchQueries: ["MyJourneys", "MyJourney"],
      });
      // reset dirty state
      reset(data);
    } catch {
      setSnackBarData({
        type: "error",
        message: "Polun päivityksessä tapahtui virhe",
      });
    }
  };

  const createJourneySubmit = async data => {
    try {
      const { data: createData } = createJourney({
        variables: {
          input: {
            data: {
              ...data,
              // user related details et al.
              ownerGroup: user?.group?.id,
            },
          },
        },
        refetchQueries: ["MyJourneys", "MyJourney"],
      });

      if (createData?.createJourney?.journey?.id) {
        // set result as activePoi
        setActivePoi(createData?.createJourney?.journey);
        // disable marker edit mode
        setMarkerEditMode(false);
        // reset dirty form state
        reset(data);
      }
    } catch {
      setSnackBarData({
        type: "error",
        message: "Polun tallennuksessa tapahtui virhe",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Polun nimi ja lyhyt kuvaus
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Anna polulle kuvaava nimi ja lyhyt kuvaus. Nimi ja kuvaus näkyvät
        polkujen listauksessa sekä kartalla.
      </Typography>

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

      <FieldDescription
        control={control}
        errors={errors}
        showHelp={showHelp}
        formName={"excerpt"}
      />

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
        title={"Polun sijainti kartalla"}
        description={
          "Voit valita polun sijainnin kartalta klikkaamalla karttaikonia tai \
          käyttämällä omaa sijaintiasi klikkaamalla paikannusikonia. \
          Valitse myös polun ympyrän säde, jolla polku on kartalla aktiivinen. \
          Polun säteen oletusarvo on 10 metriä."
        }
      />

      {/* TODO: https://mui.com/material-ui/react-slider/#non-linear-scale */}
      {activePoi && (
        <FieldSlider
          control={control}
          setActivePoi={setActivePoi}
          activePoi={activePoi}
          showHelp={showHelp}
          max={10000}
          step={50}
        />
      )}

      <FieldImageUpload
        setValue={setValue}
        activePoi={activePoi}
        showHelp={showHelp}
        title={"Polun kansikuva"}
        description={
          "Valitse polulle kansikuva. Kansikuva näytetään polun tiedoissa, \
          polkulistoissa sekä kartalla polun pääkuvana."
        }
        setSnackBarData={setSnackBarData}
      />

      {activePoi && (
        <FieldGpxRoute
          setValue={setValue}
          showHelp={showHelp}
          activePoi={activePoi}
          title="Polun GPX-reitti"
          description="Valitse GPX-reittitiedosto, jolla voidaan esittää polun ehdotettu reitti kartalla."
          setSnackBarData={setSnackBarData}
        />
      )}

      <FieldSubmitController
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        handleCancel={handleFormCancel}
      />
    </form>
  );
}
