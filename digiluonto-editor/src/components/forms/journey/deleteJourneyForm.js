import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FieldSubmitController from "../fields/submit";

const DELETE_JOURNEY_MUTATION = gql`
  mutation DELETE_JOURNEY_MUTATION($input: deleteJourneyInput!) {
    deleteJourney(input: $input) {
      journey {
        id
      }
    }
  }
`;

export default function DeleteJourneyForm({
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
    await deleteJourneySubmit(data);
    handleFormCancel();
    setSnackBarData({ type: "success", message: "Polun tiedot poistettu" });
  };

  const [deleteJourney] = useMutation(DELETE_JOURNEY_MUTATION);

  const deleteJourneySubmit = async () => {
    try {
      await deleteJourney({
        variables: {
          input: {
            where: {
              id: activePoi?.id,
            },
          },
        },
        update(cache) {
          cache.evict({ id: "Journey:" + activePoi?.id });
        },
        refetchQueries: ["MyJourneys"],
      });
    } catch {
      setSnackBarData({
        type: "error",
        message: "Polun tietojen poistossa tapahtui virhe",
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
        submitButtonText="Poista polku"
      />
    </form>
  );
}
