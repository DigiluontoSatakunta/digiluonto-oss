import {useEffect} from "react";
import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

FieldVisibilityContentOptions.propTypes = {
  control: PropTypes.any.isRequired,
  watch: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  showHelp: PropTypes.bool.isRequired,
};

export default function FieldVisibilityContentOptions({
  control,
  watch,
  setValue,
  showHelp,
}) {
  const watchToken = watch("token");

  useEffect(() => {
    if (!watchToken) setValue("qr", false);
  }, [watchToken, setValue]);

  return (
    <>
      <Typography variant="h6" sx={{mt: 2, mb: 1}}>
        Paikan sisällön näyttäminen
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          Kohteeseen liittyvät sisällön näyttämisen säännöt. Tätä tekstiä tulee
          parantaa.
        </Typography>
      )}

      <Typography variant="h6" sx={{mt: 2, mb: 1, fontSize: "1rem"}}>
        Sisällön näkyminen sijainnin mukaan
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          Asettamalla sisällön julkiseksi sallit sisällön näyttämisen aina.
          Käyttäjät voivat nähdä sisällön ilman, että saapuvat paikan päälle.
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
            name="publicContent"
            render={({field: {value, onChange}}) => (
              <>
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label={
                    value
                      ? "Sisältö on näkyvissä aina"
                      : "Sisältö on näkyvissä paikan päällä"
                  }
                />
              </>
            )}
          />
        </FormGroup>
      </FormControl>

      <Typography variant="h6" sx={{mt: 2, mb: 1, fontSize: "1rem"}}>
        Sisällön lukitseminen avaimella
      </Typography>
      {showHelp && (
        <Typography variant="body2" sx={{mb: 2}}>
          Asettamalla avaimen sisältöön vaatii sisällön näkeminen avaimen
          syöttämistä paikan päällä. Avain voi ola lyhyt sana kuten "AVAIN".
          Voit myös sallia sisällön avaamisen ulkopuolisen QR-koodin avulla.
          Käyttäjä voi tällöin lukea puhelimellaan QR-koodin, joka avaa
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
            <TextField
              name="token"
              variant="filled"
              size="small"
              label="Avain"
              {...field}
            />
          )}
        />
      </FormControl>

      <FormControl
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <FormGroup>
          <Controller
            control={control}
            name="qr"
            render={({field: {value, onChange}}) => (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      disabled={!watchToken}
                      onChange={onChange}
                    />
                  }
                  label={
                    value ? "QR-koodi käytettävissä" : "QR-koodi ei käytössä"
                  }
                />
              </>
            )}
          />
        </FormGroup>
      </FormControl>
    </>
  );
}
