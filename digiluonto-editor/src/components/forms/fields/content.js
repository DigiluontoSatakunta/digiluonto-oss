import { PropTypes } from "prop-types";
import { Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import MarkDownEditor from "./markdownEditor";
import { useEffect } from "react";

FieldContent.propTypes = {
  errors: PropTypes.any.isRequired,
  control: PropTypes.any.isRequired,
  showHelp: PropTypes.bool.isRequired,
  name: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default function FieldContent({
  control,
  errors,
  showHelp,
  name = "content",
  title,
  description,
}) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
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
        <FormGroup>
          <Controller
            control={control}
            rules={{ required: true }}
            name={name}
            render={({ field: { value, onChange } }) => (
              <>
                <FormControlLabel
                  control={<MarkDownEditor value={value} onChange={onChange} />}
                />
              </>
            )}
          />
        </FormGroup>
        <Box>
          {errors[name] && (
            <Typography
              color="error"
              sx={{
                fontSize: "0.75rem",
                lineHeight: "1.66",
                letterSpacing: "0.03333em",
                margin: "0.5rem 0.5rem 0",
              }}
            >
              Lisääthän kohteelle sisällön.
            </Typography>
          )}
        </Box>
      </FormControl>
    </>
  );
}
