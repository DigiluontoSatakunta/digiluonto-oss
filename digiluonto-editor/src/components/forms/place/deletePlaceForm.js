import { useState, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FieldSubmitController from "../fields/submit";

const DELETE_PLACE_MUTATION = gql`
  mutation DELETE_PLACE_MUTATION($input: deletePlaceInput!) {
    deletePlace(input: $input) {
      place {
        id
      }
    }
  }
`;

export default function DeletePlaceForm({
  activePoi,
  handleFormCancel,
  setSnackBarData,
}) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: activePoi?.id,
    },
  });

  const onSubmit = async data => {
    await deletePlaceSubmit(data);
    handleFormCancel();
    setSnackBarData({ type: "success", message: "Paikan tiedot poistettu" });
  };

  const [deletePlace] = useMutation(DELETE_PLACE_MUTATION);

  const deletePlaceSubmit = async () => {
    try {
      await deletePlace({
        variables: {
          input: {
            where: {
              id: activePoi?.id,
            },
          },
        },
        update(cache) {
          cache.evict({ id: "Place:" + activePoi?.id });
        },
        refetchQueries: ["MyPlaces"],
      });
    } catch {
      setSnackBarData({
        type: "error",
        message: "Paikan tietojen poistossa tapahtui virhe",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        paddingLeft: 0,
        paddingRight: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 268px)",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body"
          sx={{
            mb: 2,
            textTransform: "uppercase",
            fontWeight: 500,
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.6)",
          }}
        >
          Haluatko poistaa kohteen
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {activePoi?.name}
        </Typography>
      </Box>
      <FieldSubmitController
        handleCancel={handleFormCancel}
        isSubmitting={isSubmitting}
        isDirty={true}
        submitButtonText="Poista paikka"
      />
    </form>
  );
}
