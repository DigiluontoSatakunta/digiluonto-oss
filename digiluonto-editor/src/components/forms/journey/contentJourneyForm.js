import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import FieldLinks from "../fields/links";
import FieldContent from "../fields/content";
import FieldBoolean from "../fields/boolean";
import FieldAudioGuide from "../fields/audioGuide";
import FieldEnumSelector from "../fields/enums";
import FieldNumber from "../fields/number";
import FieldSubmitController from "../fields/submit";

import { JOURNEY_EXTENDED_CONTENT, formValueResolver } from "../defaultValues";
import { UPDATE_JOURNEY_MUTATION } from "../../../hooks/journeys";

export default function ContentJourneyForm({
  activePoi,
  showHelp,
  handleFormCancel,
  setSnackBarData,
}) {
  const [updateJourney] = useMutation(UPDATE_JOURNEY_MUTATION);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: JOURNEY_EXTENDED_CONTENT,
  });

  const {
    fields: links,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = async data => await updateJourneySubmit(data);

  useEffect(() => {
    if (activePoi?.__typename === "Journey") {
      const values = formValueResolver(
        JOURNEY_EXTENDED_CONTENT,
        activePoi,
        "Journey"
      );
      reset(values.resolvedObjects);
    }
  }, [activePoi, reset]);

  const updateJourneySubmit = async data => {
    try {
      await updateJourney({
        variables: {
          input: {
            where: { id: activePoi?.id },
            data,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <FieldContent
        name="description"
        control={control}
        errors={errors}
        showHelp={showHelp}
        title="Polun sisältö"
        description="Polun sisältö, joka voi sisältää Markdown muotoiltua tekstiä."
      />

      <FieldBoolean
        name="allowRating"
        control={control}
        labelTrue="Sallittu"
        labelFalse="Ei sallittu"
        title="Polun arviointi"
        description="Sallimalla arvioinnin käyttäjät voivat antaa sille 1-5 tähteä arviona."
        showHelp={showHelp}
      />

      {activePoi && (
        <FieldAudioGuide
          setValue={setValue}
          showHelp={showHelp}
          activePoi={activePoi}
          title="Polun ääniopas"
          description="Valitse äänitiedosto, jonka käyttäjä voi soittaa kohteessa. Ääniopas pitää olla MP3-tiedosto."
          setSnackBarData={setSnackBarData}
        />
      )}

      {activePoi?.audioGuide !== null && (
        <FieldBoolean
          name="audioLoop"
          control={control}
          labelTrue="Toista silmukassa"
          labelFalse="Toista vain kerran"
          title="Toista ääniopasta jatkuvasti"
          description="Tällä valinnalla ääniopasta soitetaan silmukassa. Valinnan voi tehdä vain mikäli äänitiedosto on asetettu."
          showHelp={showHelp}
        />
      )}

      {links && (
        <FieldLinks
          control={control}
          links={links}
          append={append}
          register={register}
          remove={remove}
          showHelp={showHelp}
          title="Polun linkit"
          description="Voit lisätä oman sisällön lisäksi ulkoisia sisältöjä linkkeinä."
        />
      )}

      <FieldEnumSelector
        control={control}
        title="Ryhmän koko"
        description="Valitse polulle suositeltu ryhmäkoko."
        variant="groupSize"
      />
      <FieldEnumSelector
        control={control}
        title="Kohderyhmä"
        description="Valitse polun kohderyhmä."
        variant="targetGroup"
      />
      <FieldEnumSelector
        control={control}
        title="Vaikeustaso"
        description="Valitse polun vaikeustaso."
        variant="difficulty"
      />
      <FieldEnumSelector
        control={control}
        title="Kategoria"
        description="Valitse polun kategoria."
        variant="category"
      />
      <FieldEnumSelector
        control={control}
        title="Saavutettavuus"
        description="Valitse polun saavutettavuus."
        variant="accessibility"
      />

      <FieldBoolean
        name="calculateDistance"
        control={control}
        labelTrue="Laske pituus automaattisesti"
        labelFalse="Syötä arvo manuaalisesti"
        title="Polun pituus"
        description="Määrittelee, että lasketaanko polun pituus automaattisesti, vai syötetäänkö arvo manuaalisesti."
        showHelp={showHelp}
      />

      {!watch("calculateDistance") && (
        <FieldNumber
          name="distance"
          title="Polun pituus"
          description="Tässä voit manuaalisesti asettaa polun pituuden metreissä"
          errorLabel="Syötä kokonaisluku, joka on vähintään 0"
          register={register}
          showHelp={showHelp}
          showTitle={false}
          errors={errors}
          rules={{
            required: true,
            min: 0,
          }}
        />
      )}

      <FieldNumber
        name="duration"
        title="Polun kesto"
        description="Aseta polun arvioitu kesto minuutteina"
        errorLabel="Syötä kokonaisluku, joka on vähintään 0"
        register={register}
        showHelp={showHelp}
        errors={errors}
        rules={{
          required: true,
          min: 0,
        }}
      />
      <FieldNumber
        name="elevation"
        title="Polun korkeusero"
        description="Tässä voit manuaalisesti asettaa polun korkeuseron metreissä"
        errorLabel="Syötä kokonaisluku, joka on vähintään 0"
        register={register}
        showHelp={showHelp}
        errors={errors}
        rules={{
          required: true,
          min: 0,
        }}
      />

      <FieldSubmitController
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        handleCancel={handleFormCancel}
      />
    </form>
  );
}
