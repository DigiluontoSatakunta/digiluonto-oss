import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import FieldAR from "../fields/ar";
import FieldLinks from "../fields/links";
import FieldQuestions from "../fields/questions";
import FieldContent from "../fields/content";
import FieldBoolean from "../fields/boolean";
import FieldAudioGuide from "../fields/audioGuide";
import FieldGalleryUpload from "../fields/gallery";
import FieldSubmitController from "../fields/submit";

import { UPDATE_PLACE_MUTATION } from "../../../hooks/places";

export default function ContentPlaceForm({
  activePoi,
  showHelp,
  handleFormCancel,
  setSnackBarData,
}) {
  const [updatePlace] = useMutation(UPDATE_PLACE_MUTATION);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      content: "",
      allowRating: false,
      audioGuide: null,
      links: [],
    },
  });

  const {
    fields: links,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = async data => {
    await updatePlaceSubmit(data);
    setSnackBarData({ type: "success", message: "Tiedot tallennettu!" });
  };

  useEffect(() => {
    if (activePoi) {
      setValue("content", activePoi?.content);
      setValue("allowRating", activePoi?.allowRating);
      setValue("audioGuide", activePoi?.audioGuide?.id);
      setValue("questions", activePoi?.questions);
      setValue(
        "links",
        activePoi?.links?.map(({ id, name, url, type }) => ({
          id,
          name,
          url,
          type,
        }))
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGalleryUpload
        setValue={setValue}
        getValues={getValues}
        control={control}
        activePoi={activePoi}
        showHelp={showHelp}
        title={"Paikan kuvagalleria"}
        description={
          "Valitse paikalle kuvia galleriaa varten. Galleria näytetään paikan tiedoissa."
        }
        setSnackBarData={setSnackBarData}
      />
      <FieldContent
        control={control}
        errors={errors}
        showHelp={showHelp}
        title="Polun sisältö"
        description="Polun sisältö, joka voi sisältää Markdown muotoiltua tekstiä."
        setSnackBarData={setSnackBarData}
      />

      <FieldBoolean
        name="allowRating"
        control={control}
        labelTrue="Sallittu"
        labelFalse="Ei sallittu"
        title="Paikan arviointi"
        description="Sallimalla arvioinnin käyttäjät voivat antaa sille 1-5 tähteä arviona."
        showHelp={showHelp}
      />

      {activePoi && (
        <FieldAudioGuide
          setValue={setValue}
          showHelp={showHelp}
          activePoi={activePoi}
          title="Paikan ääniopas"
          description="Valitse äänitiedosto, jonka käyttäjä voi soittaa kohteessa. Ääniopas pitää olla MP3-tiedosto."
          setSnackBarData={setSnackBarData}
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
          title="Paikan linkit"
          description="Voit lisätä oman sisällön lisäksi ulkoisia sisältöjä paikkaan linkkeinä."
        />
      )}

      {activePoi && (
        <FieldQuestions
          append={append}
          remove={remove}
          setValue={setValue}
          getValues={getValues}
          activePoi={activePoi}
          control={control}
          showHelp={showHelp}
          title="Paikan kysymys"
          description="Voit lisätä paikkaan kysymyksen ja vastausvaihtoehdot. Huomioithan, että tällä hetkellä tuetaan vain yksi kysymys/paikka"
        />
      )}

      <FieldAR
        setValue={setValue}
        showHelp={showHelp}
        activePoi={activePoi}
        title="Paikan AR-sisältö"
        description="AR-sisällöllä voidaan esittää paikkaan liittyvää, kameran näkemää lisättyä sisältöä kolmiulotteisten objektien muodossa."
        help="Tässä voit lisätä uuden 3D-mallitiedoston GLB-formaatissa."
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
