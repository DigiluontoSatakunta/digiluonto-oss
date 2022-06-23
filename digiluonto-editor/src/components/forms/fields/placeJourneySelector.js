import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import {useMyJourneys} from "../../../hooks/journeys";

FieldPlaceInJourneySelector.propTypes = {
  control: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FieldPlaceInJourneySelector({
  control,
  description,
  title,
  showHelp,
}) {
  const {journeys, loading} = useMyJourneys();

  const handleChangeJourney = event => {
    setJourney({
      name: journey?.name,
      id: event.target.value,
      __typename: "Journey",
    });
  };

  if (loading) return <></>;

  return (
    <>
      <Typography variant="h6" sx={{mt: 2, mb: 1}}>
        {title}
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          {description}
        </Typography>
      )}

      {journeys?.length > 0 && (
        <FormControl
          fullWidth={true}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
        >
          <InputLabel id="place-journey-label">Polku</InputLabel>
          <Controller
            name="journeys"
            control={control}
            render={({field}) => (
              <Select
                id="place-journey"
                variant="filled"
                label="Polku"
                onChange={handleChangeJourney}
                {...field}
                multiple
              >
                <MenuItem value="" disabled>
                  <em>Valitse polku tai polkuja</em>
                </MenuItem>
                {journeys?.map(j => (
                  <MenuItem key={j.id} value={j.id}>
                    {j.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      )}
    </>
  );
}
