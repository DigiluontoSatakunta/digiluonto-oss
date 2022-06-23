import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Slider from "@mui/material/Slider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

// FlexSlider.PropTypes = {
// setValue: PropTypes.func,
// setActivePoi: PropTypes.func,
// setActiveMarkerRadius: PropTypes.func,
// activePoi: PropTypes.object,
// activeMarkerRadius: PropTypes.number,
// min: PropTypes.number,
// max: PropTypes.number,
// step: PropTypes.number,
// };

export default function FieldSlider({
  control,
  activePoi,
  setActivePoi,
  min = 10,
  max = 100,
  step = 10,
}) {
  /**
   * Additional onChange handler to update activePoi
   * @param {event} _
   * @param {number} value
   */
  const handleChange = (_, value) => {
    setActivePoi(prev => ({
      ...prev,
      geoJSON: {
        ...prev?.geoJSON,
        properties: {
          ...prev?.geoJSON?.properties,
          radius: value,
        },
      },
    }));
  };

  function valuetext(value) {
    return `Kohteen ympyrän säde on ${value} metriä.`;
  }

  return (
    <FormControl
      fullWidth={true}
      sx={{
        mb: 1,
        pl: 1,
        pr: 1,
      }}
    >
      <Controller
        name="radius"
        control={control}
        render={({field: {value, onChange}}) => (
          <>
            <Slider
              disabled={!activePoi}
              name="radius"
              key="radius"
              onChange={(e, val) => { onChange(e); handleChange(e, val); }}
              aria-label="Kohteen ympyrän säde"
              value={value}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              marks
              step={step}
              min={min}
              max={max}
            />
            <FormHelperText>{valuetext(value)}</FormHelperText>
          </>
        )}
      />
    </FormControl>
  );
}
