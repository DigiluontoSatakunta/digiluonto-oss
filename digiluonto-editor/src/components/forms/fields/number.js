import PropTypes from "prop-types";

import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";

FieldNumber.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  errorLabel: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  showHelp: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool,
  errors: PropTypes.any.isRequired,
  rules: PropTypes.object,
};

export default function FieldNumber({
  name,
  title,
  description,
  errorLabel,
  register,
  showHelp,
  showTitle = true,
  errors,
  rules = {},
}) {
  return (
    <>
      {showTitle && (
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {title}
        </Typography>
      )}
      {showHelp && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <FormControl
        component="fieldset"
        variant="standard"
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <TextField
          type="number"
          variant="filled"
          size="small"
          label={title}
          error={errors[name] ? true : false}
          helperText={errors[name] ? errorLabel : null}
          {...register(
            name,
            {
              valueAsNumber: true, // always interpret values as numbers
              ...rules, // any additional user specified rules
            }
          )}
        />
      </FormControl>
    </>
  );
}
