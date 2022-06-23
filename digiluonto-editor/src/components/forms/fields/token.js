import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

FieldToken.propTypes = {
  control: PropTypes.any.isRequired,
};

export default function FieldToken({control, showHelp}) {
  return (
    <>
      <Typography variant="h6" sx={{mt: 2, mb: 1}}>
        Sisällön avain
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          Voit vaatia sisällön lukemiseksi avaimen (esim. AVAIN) käyttöä. Kun
          käyttäjä syöttää oikean avaimen paikkaan saapuessaan näkee hän paikan
          sisällön.
        </Typography>
      )}

      <FormControl
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <Controller
          name="token"
          control={control}
          render={({field}) => (
            <TextField variant="filled" size="small" label="Avain" {...field} />
          )}
        />
      </FormControl>
    </>
  );
}
