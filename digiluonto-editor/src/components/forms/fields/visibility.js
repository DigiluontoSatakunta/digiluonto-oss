import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

FieldVisibilityOptions.propTypes = {
  control: PropTypes.any.isRequired,
  isFeatured: PropTypes.bool,
  isPublic: PropTypes.bool,
  isPublicContent: PropTypes.bool,
  showNextPlace: PropTypes.bool,
  showPlacesInJourneysArea: PropTypes.bool,
};

export default function FieldVisibilityOptions({
  control,
  isFeatured,
  isPublic,
  isPublicContent,
  showNextPlace,
  showPlacesInJourneysArea,
}) {
  return (
    <>
      <Typography variant="h6" sx={{mt: 2, mb: 1}}>
        Näkyvyyssäännöt
      </Typography>
      <Typography variant="body2" sx={{mb: 2}}>
        Kohteeseen liittyvät näkyvyyssäännöt.
      </Typography>

      <FormControl
        component="fieldset"
        variant="standard"
        fullWidth={true}
        sx={{
          mb: 1,
        }}
      >
        <FormGroup>
          {
            // common option
            isPublic && (
              <Controller
                control={control}
                name="public"
                render={({field: {value, onChange}}) => (
                  <>
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="Julkinen kohde"
                    />
                    <FormHelperText>
                      Näytetäänkö kohde oman ryhmän ulkopuolisille
                    </FormHelperText>
                  </>
                )}
              />
            )
          }

          {
            // place related option
            isPublicContent && (
              <Controller
                control={control}
                name="publicContent"
                render={({field: {value, onChange}}) => (
                  <>
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="Julkinen sisältö"
                    />
                    <FormHelperText>
                      Kun valittuna niin pitää olla paikassa nähdäkseen sisällön
                    </FormHelperText>
                  </>
                )}
              />
            )
          }

          {
            // journey related option
            isFeatured && (
              <Controller
                control={control}
                name="featured"
                render={({field: {value, onChange}}) => (
                  <>
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="Suositeltu polku"
                    />
                    <FormHelperText>
                      Kun valittuna niin näyttää polun etusivun suositellut
                      listalla
                    </FormHelperText>
                  </>
                )}
              />
            )
          }

          {
            // journey related option
            showNextPlace && (
              <Controller
                control={control}
                name="showNextPlace"
                render={({field: {value, onChange}}) => (
                  <>
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="Näytä seuraava paikka polulla"
                    />
                    <FormHelperText>
                      Näytetäänkö seuraava paikka -painike
                    </FormHelperText>
                  </>
                )}
              />
            )
          }

          {
            // journey related option
            showPlacesInJourneysArea && (
              <Controller
                control={control}
                name="showPlacesInJourneysArea"
                render={({field: {value, onChange}}) => (
                  <>
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="Näytä paikat polun alueella"
                    />
                    <FormHelperText>
                      Sallii polkuun liittyvien paikkojen näkymisen myös silloin,
                      kun ollaan polkuun määritellyn ympyrän säteen sisällä.
                    </FormHelperText>
                  </>
                )}
              />
            )
          }
        </FormGroup>
      </FormControl>
    </>
  );
}
