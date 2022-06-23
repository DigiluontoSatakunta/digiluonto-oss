import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import {useTags} from "../../../hooks/tags";

FieldTagSelector.propTypes = {
  control: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FieldTagSelector({
  control,
  description,
  title,
  showHelp,
}) {
  const {tags, loading} = useTags();

  if (loading) return <></>;

  return (
    <>
      <Typography variant="h6" sx={{mb: 1}}>
        {title}
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          {description}
        </Typography>
      )}

      {tags?.length > 0 && (
        <FormControl
          fullWidth={true}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
        >
          <InputLabel id="place-tag-label">Tunniste</InputLabel>
          <Controller
            name="tags"
            control={control}
            render={({field}) => (
              <Select
                id="tags"
                variant="filled"
                label="Tunniste"
                {...field}
                // DIG-1075 & DIG-1086 keeps react-hook-form happy about null values
                onChange={(event) => field.onChange(event.target.value || [])}
                value={field.value ?? ""} // transforms nullish back to ""
              >
                <MenuItem value="">
                  <em>Valitse tunniste</em>
                </MenuItem>
                {tags?.map(t => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
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
