import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";

FieldDateTimeLocal.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
  showHelp: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
};

export default function FieldDateTimeLocal({
  name,
  control,
  showHelp,
  title,
  description,
}) {

  function timezoneResolver(value){
    if (value === "" || value === null) {
      return "";
    }
    const dateObj = new Date(value);
    if (isNaN(dateObj)) {
      return "";
    }
    const OFFSET_TO_ZULU = dateObj.getTimezoneOffset()*60000; // in milliseconds
    return new Date(dateObj.valueOf()-OFFSET_TO_ZULU).toISOString().substring(0,16);
  }

  return (
    <>
      { title &&
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {title}
        </Typography>
      }
      {showHelp && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <FormControl
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({field}) => (
            <TextField
              type="datetime-local"
              onChange={(event) => field.onChange(event.target.value !== null
                ? new Date(event.target.value) : null)}
              value={timezoneResolver(field.value)}
            />
          )}
        />
      </FormControl>
    </>
  );
}
