import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import FieldTagSelector from "../fields/tags";
import FieldSubmitController from "../fields/submit";
import FieldBoolean from "../fields/boolean";
import FieldPlaceInJourneySelector from "../fields/placeJourneySelector";
import FieldVisibilityContentOptions from "../fields/visibilityContent";
import FieldDateTimeLocal from "../fields/datetime-local";
import FieldEnumSelector from "../fields/enums";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";

export default function VisibilityPlaceForm({
  activePoi,
  handleFormCancel,
  showHelp,
  setSnackBarData,
}) {
  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      tags: [],
      journeys: [],
      publicContent: true,
      public: true,
      token: "",
      qr: false,
      publishDate: "2022-01-01T12:00:00Z",
      expirationDate: "2029-12-31T23:59:00Z",
      icon: "postal_code",
    },
  });

  const onSubmit = async data => {
    await updatePlaceSubmit(data);
    setSnackBarData({ type: "success", message: "Tiedot tallennettu!" });
  };
  useEffect(() => {
    setValue("publicContent", activePoi?.publicContent);
    setValue("public", activePoi?.public);
    setValue("token", activePoi?.token);
    setValue("qr", activePoi?.qr);
    setValue("publishDate", activePoi?.publishDate);
    setValue("expirationDate", activePoi?.expirationDate);

    if (activePoi) {
      setValue(
        "tags",
        activePoi?.tags?.map(tag => tag.id)
      );
      setValue(
        "journeys",
        activePoi?.journeys?.map(journey => journey.id)
      );
    }
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
        update(cache) {
          activePoi?.journeys?.map(journey => {
            cache.evict({ id: "Journey:" + journey.id });
          });
        },
        refetchQueries: ["MyPlaces", "MyPlace", "MyJourneys"],
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <FieldDateTimeLocal
        name="publishDate"
        control={control}
        showHelp={showHelp}
        title="Julkaisu- ja piilotuspäivämäärä"
        description="Kohteen julkaisupäivämäärä. Jos jätät kentän tyhjäksi, kohde julkaistaan heti."
      />

      <FieldDateTimeLocal
        name="expirationDate"
        control={control}
        showHelp={showHelp}
        description="Kohteen piilotuspäivämäärä. Jos jätät kentän tyhjäksi, kohdetta ei piiloteta päivämäärän mukaan."
      />

      <FieldTagSelector
        control={control}
        showHelp={showHelp}
        title="Paikan tunniste"
        description="Valitse paikalle luokittelutunniste, joka kuvaa paikan luonnetta tai tyyppiä. Tunniste näytetään paikkojen suodatuksessa ja vaikuttaa näin näkyvyyteen kartalla."
      />

      <FieldPlaceInJourneySelector
        control={control}
        showHelp={showHelp}
        title="Paikan näkyminen polussa"
        description="Voit liittää paikan osaksi olemassa olevaa polkua."
      />

      <FieldEnumSelector
        control={control}
        title="Paikan ikoni"
        description="Valitse paikan kartalla näkyvä ikoni."
        variant="icon"
      />

      <FieldBoolean
        name="public"
        control={control}
        showHelp={showHelp}
        labelTrue="Näkyminen sallittu kaikille"
        labelFalse="Näkyminen sallittu vain omalle organisaatiolle"
        title="Paikan näkyminen oman organisaation ulkopuolella"
        description="Sallimalla paikan näkymisen organisaation ulkopuolella, myös muut Digiluonnon käyttäjät voivat nähdä paikan kartalla."
      />

      <FieldVisibilityContentOptions
        watch={watch}
        errors={errors}
        control={control}
        setValue={setValue}
        showHelp={showHelp}
      />

      <FieldSubmitController
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        handleCancel={handleFormCancel}
      />
    </form>
  );
}
