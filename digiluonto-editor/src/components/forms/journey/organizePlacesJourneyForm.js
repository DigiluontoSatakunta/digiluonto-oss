import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import FieldJourneyPlaceOrganizer from "../fields/journeyPlaceOrganizer";
import FieldTagSelector from "../fields/tags";
import FieldSubmitController from "../fields/submit";
import FieldVisibilityOptions from "../fields/visibility";
import FieldDateTimeLocal from "../fields/datetime-local";

import { JOURNEY_VISIBILITY, formValueResolver } from "../defaultValues";
import { UPDATE_JOURNEY_MUTATION } from "../../../hooks/journeys";
import { useMyPlaces } from "../../../hooks/places";

export default function OrganizePlacesJourneyForm({
  activePoi,
  handleFormCancel,
  showHelp,
  setSnackBarData,
}) {
  const {places, loading} = useMyPlaces();
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: JOURNEY_VISIBILITY,
  });

  const onSubmit = async data => await updateJourneySubmit(data);

  useEffect(() => {
    if (activePoi?.__typename === "Journey") {
      const values = formValueResolver(
        JOURNEY_VISIBILITY,
        activePoi,
        "Journey",
        { placeIds: places.map(item => item.id) },
      );
      // sets all values at once, dirty-state also behaves more reliably now
      reset(values.resolvedObjects);
    }
  }, [activePoi, places, reset]);

  const updateJourneySubmit = async data => {
    try {
      await updateJourney({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data: {
              ...data,
              // order does not need to be serialized (JSON.stringify) because it creates more problems
              // i.e., any modifications in strapi will reformat it to pure JSON array anyway
              order: data?.places?.length > 0 ? data.places : null,
            },
          },
        },
        refetchQueries: ["MyPlaces", "MyJourneys", "MyJourney"],
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

  if (loading) return <></>;

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
        title={"Polun tunniste"}
        description={
          "Valitse polulle luokittelutunniste, joka kuvaa polun luonnetta tai \
          tyyppiä. Tunniste näytetään suodatuksessa ja vaikuttaa näin näkyvyyteen kartalla."
        }
      />

      <FieldVisibilityOptions
        control={control}
        isFeatured={true}
        isPublic={true}
        showNextPlace={true}
        showPlacesInJourneysArea={true}
      />

      <FieldJourneyPlaceOrganizer
        control={control}
        title={"Polussa olevat paikat"}
        description={"Järjestele polkuun liittyvät paikat tarpeesi mukaan."}
      />

      <FieldSubmitController
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        handleCancel={handleFormCancel}
      />
    </form>
  );
}
