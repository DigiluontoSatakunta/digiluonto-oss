import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

FieldBoolean.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelFalse: PropTypes.string.isRequired,
  labelTrue: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
  showHelp: PropTypes.bool.isRequired,
};

export default function FieldBoolean({
  name,
  title,
  description,
  labelTrue,
  labelFalse,
  control,
  showHelp,
}) {
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

      <FormControl
        component="fieldset"
        variant="standard"
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <FormGroup>
          <Controller
            control={control}
            name={name}
            render={({field: {value, onChange}}) => (
              <>
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label={value ? labelTrue : labelFalse}
                />
              </>
            )}
          />
        </FormGroup>
      </FormControl>
    </>
  );
}
