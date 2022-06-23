import {useCallback, useState} from "react";
import {useMutation} from "@apollo/client";

import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { PUBLISH_PLACE_MUTATION } from "../../../hooks/places";
import { PUBLISH_JOURNEY_MUTATION } from "../../../hooks/journeys";

const getCurrentISODate = () => {
  const date = new Date();
  return date.toISOString();
};

export default function FieldPublishSwitch({activePoi, setSnackBarData}) {
  const [checked, setChecked] = useState(!!activePoi?.published_at);

  const [updatePublishPlaceStateMutation] = useMutation(PUBLISH_PLACE_MUTATION);
  const [updatePublishJourneyStateMutation] = useMutation(PUBLISH_JOURNEY_MUTATION);

  const handleChange = () => {
    if (activePoi?.__typename === "Place") {
      updatePublishPlaceState();
    } else if (activePoi?.__typename === "Journey") {
      updatePublishJourneyState();
    }
  };

  const updatePublishPlaceState = useCallback(async () => {
    try {
      const {data} = await updatePublishPlaceStateMutation({
        variables: {
          input: {
            data: {
              published_at: activePoi?.published_at
                ? null
                : getCurrentISODate(),
            },
            where: {
              id: activePoi?.id,
            },
          },
        },
        refetchQueries: ["MyPlace"],
      });
      if (data?.updatePlace?.place)
        setChecked(!!data?.updatePlace?.place.published_at);
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Paikan julkaisutilan muuttaminen epäonnistui",
      });
    }
  }, [activePoi, updatePublishPlaceStateMutation, setChecked, setSnackBarData]);

  const updatePublishJourneyState = useCallback(async () => {
    try {
      const {data} = await updatePublishJourneyStateMutation({
        variables: {
          input: {
            data: {
              published_at: activePoi?.published_at
                ? null
                : getCurrentISODate(),
            },
            where: {
              id: activePoi?.id,
            },
          },
        },
        refetchQueries: ["MyJourney"],
      });
      if (data?.updateJourney?.journey)
        setChecked(!!data?.updateJourney?.journey.published_at);
    } catch (e) {
      setSnackBarData({
        type: "error",
        message: "Polun julkaisutilan muuttaminen epäonnistui",
      });
    }
  }, [activePoi, updatePublishJourneyStateMutation, setChecked, setSnackBarData]);

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        labelPlacement="start"
        label={checked ? "Julkaistu" : "Luonnos"}
      />
    </FormGroup>
  );
}
