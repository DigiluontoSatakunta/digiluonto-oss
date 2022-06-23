import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {Controller} from "react-hook-form";

export default function FieldDescription({
  control,
  errors,
  formName = "description",
}) {
  return (
    <FormControl
      fullWidth={true}
      sx={{
        mb: 1,
      }}
    >
      <Controller
        name={formName}
        control={control}
        rules={{required: true, maxLength: 255}}
        render={({field}) => (
          <TextField
            variant="filled"
            size="small"
            label="Lyhyt kuvaus"
            multiline
            rows={4}
            error={errors[formName] ? true : false}
            helperText={
              errors[formName]
                ? "Lisääthän kohteelle lyhyen kuvauksen. Kuvaus näkyy kartalla käyttäjälle."
                : null
            }
            {...field}
          />
        )}
      />
    </FormControl>
  );
}
