import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

export const ENUM_DEFINITIONS = {
  accessibility: {
    name: "Saavutettavuus",
    items: [
      {id: "accessibilityNormal", name: "Tavanomainen"},
      {id: "accessibilityChallenging", name: "Haastava"},
    ],
  },
  category: {
    name: "Kategoria",
    items: [
      {id: "photographic_exhibition", name: "Valokuvanäyttely"},
      {id: "vr_installation", name: "VR-installaatio"},
    ],
  },
  difficulty: {
    name: "Vaikeusaste",
    items: [
      {id: "easy", name: "Helppo"},
      {id: "normal", name: "Keskitaso"},
      {id: "hard", name: "Vaikea"},
    ],
  },
  groupSize: {
    name: "Ryhmäkoko",
    items: [
      {id: "individual", name: "Yksilöt"},
      {id: "small_group", name: "Pienryhmät"},
      {id: "group", name: "Ryhmät"},
    ],
  },
  targetGroup: {
    name: "Kohderyhmä",
    items: [
      {id: "individual", name: "Yksilöt"},
      {id: "group", name: "Ryhmät"},
      {id: "b2c", name: "Henkilöasiakkaat"},
      {id: "b2b", name: "Yritysasiakkaat"},
    ],
  },
  type: {
    name: "Linkin sisältötyyppi",
    items: [
      {id: "AR", name: "Augmented Reality (AR)"},
      {id: "AUDIO", name: "Audio"},
      {id: "IFRAME", name: "Web-kehys (IFrame)"},
      {id: "LINK", name: "Linkki"},
      {id: "VIDEO", name: "Video"},
      {id: "GAME", name: "Peli"},
    ],
  },
  icon: {
    name: "Paikan ikoni",
    items: [
      {id: "abseiling", name: "abseiling"},
      {id: "accounting", name: "accounting"},
      {id: "airport", name: "airport"},
      {id: "amusement_park", name: "amusement_park"},
      {id: "aquarium", name: "aquarium"},
      {id: "archery", name: "archery"},
      {id: "art_gallery", name: "art_gallery"},
      {id: "assistive_listening_system", name: "assistive_listening_system"},
      {id: "atm", name: "atm"},
      {id: "audio_description", name: "audio_description"},
      {id: "bakery", name: "bakery"},
      {id: "bank", name: "bank"},
      {id: "bar", name: "bar"},
      {id: "baseball", name: "baseball"},
      {id: "beauty_salon", name: "beauty_salon"},
      {id: "bicycle_store", name: "bicycle_store"},
      {id: "bicycling", name: "bicycling"},
      {id: "boat_ramp", name: "boat_ramp"},
      {id: "boat_tour", name: "boat_tour"},
      {id: "boating", name: "boating"},
      {id: "book_store", name: "book_store"},
      {id: "bowling_alley", name: "bowling_alley"},
      {id: "braille", name: "braille"},
      {id: "bus_station", name: "bus_station"},
      {id: "cafe", name: "cafe"},
      {id: "campground", name: "campground"},
      {id: "canoe", name: "canoe"},
      {id: "car_dealer", name: "car_dealer"},
      {id: "car_rental", name: "car_rental"},
      {id: "car_repair", name: "car_repair"},
      {id: "car_wash", name: "car_wash"},
      {id: "casino", name: "casino"},
      {id: "cemetery", name: "cemetery"},
      {id: "chairlift", name: "chairlift"},
      {id: "church", name: "church"},
      {id: "city_hall", name: "city_hall"},
      {id: "climbing", name: "climbing"},
      {id: "closed_captioning", name: "closed_captioning"},
      {id: "clothing_store", name: "clothing_store"},
      {id: "compass", name: "compass"},
      {id: "convenience_store", name: "convenience_store"},
      {id: "courthouse", name: "courthouse"},
      {id: "cross_country_skiing", name: "cross_country_skiing"},
      {id: "crosshairs", name: "crosshairs"},
      {id: "dentist", name: "dentist"},
      {id: "department_store", name: "department_store"},
      {id: "diving", name: "diving"},
      {id: "doctor", name: "doctor"},
      {id: "electrician", name: "electrician"},
      {id: "electronics_store", name: "electronics_store"},
      {id: "embassy", name: "embassy"},
      {id: "female", name: "female"},
      {id: "finance", name: "finance"},
      {id: "fire_station", name: "fire_station"},
      {id: "fish_cleaning", name: "fish_cleaning"},
      {id: "fishing_pier", name: "fishing_pier"},
      {id: "fishing", name: "fishing"},
      {id: "florist", name: "florist"},
      {id: "food", name: "food"},
      {id: "funeral_home", name: "funeral_home"},
      {id: "furniture_store", name: "furniture_store"},
      {id: "gas_station", name: "gas_station"},
      {id: "general_contractor", name: "general_contractor"},
      {id: "golf", name: "golf"},
      {id: "grocery_or_supermarket", name: "grocery_or_supermarket"},
      {id: "gym", name: "gym"},
      {id: "hair_care", name: "hair_care"},
      {id: "hang_gliding", name: "hang_gliding"},
      {id: "hardware_store", name: "hardware_store"},
      {id: "health", name: "health"},
      {id: "hindu_temple", name: "hindu_temple"},
      {id: "horse_riding", name: "horse_riding"},
      {id: "hospital", name: "hospital"},
      {id: "ice_fishing", name: "ice_fishing"},
      {id: "ice_skating", name: "ice_skating"},
      {id: "inline_skating", name: "inline_skating"},
      {id: "insurance_agency", name: "insurance_agency"},
      {id: "jet_skiing", name: "jet_skiing"},
      {id: "jewelry_store", name: "jewelry_store"},
      {id: "kayaking", name: "kayaking"},
      {id: "laundry", name: "laundry"},
      {id: "lawyer", name: "lawyer"},
      {id: "library", name: "library"},
      {id: "liquor_store", name: "liquor_store"},
      {id: "local_government", name: "local_government"},
      {id: "locksmith", name: "locksmith"},
      {id: "lodging", name: "lodging"},
      {id: "low_vision_access", name: "low_vision_access"},
      {id: "male", name: "male"},
      {id: "marina", name: "marina"},
      {id: "mosque", name: "mosque"},
      {id: "motobike_trail", name: "motobike_trail"},
      {id: "movie_rental", name: "movie_rental"},
      {id: "movie_theater", name: "movie_theater"},
      {id: "moving_company", name: "moving_company"},
      {id: "museum", name: "museum"},
      {id: "natural_feature", name: "natural_feature"},
      {id: "night_club", name: "night_club"},
      {id: "open_captioning", name: "open_captioning"},
      {id: "painter", name: "painter"},
      {id: "park", name: "park"},
      {id: "parking", name: "parking"},
      {id: "pet_store", name: "pet_store"},
      {id: "pharmacy", name: "pharmacy"},
      {id: "physiotherapist", name: "physiotherapist"},
      {id: "place_of_worship", name: "place_of_worship"},
      {id: "playground", name: "playground"},
      {id: "plumber", name: "plumber"},
      {id: "point_of_interest", name: "point_of_interest"},
      {id: "police", name: "police"},
      {id: "political", name: "political"},
      {id: "post_box", name: "post_box"},
      {id: "post_office", name: "post_office"},
      {id: "postal_code_prefix", name: "postal_code_prefix"},
      {id: "postal_code", name: "postal_code"},
      {id: "rafting", name: "rafting"},
      {id: "real_estate_agency", name: "real_estate_agency"},
      {id: "restaurant", name: "restaurant"},
      {id: "route_pin", name: "route_pin"},
      {id: "route", name: "route"},
      {id: "rv_park", name: "rv_park"},
      {id: "sailing", name: "sailing"},
      {id: "school", name: "school"},
      {id: "scuba_diving", name: "scuba_diving"},
      {id: "sheild", name: "sheild"},
      {id: "shopping_mall", name: "shopping_mall"},
      {id: "sign_language", name: "sign_language"},
      {id: "skateboarding", name: "skateboarding"},
      {id: "ski_jumping", name: "ski_jumping"},
      {id: "skiing", name: "skiing"},
      {id: "sledding", name: "sledding"},
      {id: "snow_shoeing", name: "snow_shoeing"},
      {id: "snow", name: "snow"},
      {id: "snowboarding", name: "snowboarding"},
      {id: "snowmobile", name: "snowmobile"},
      {id: "spa", name: "spa"},
      {id: "square", name: "square"},
      {id: "stadium", name: "stadium"},
      {id: "storage", name: "storage"},
      {id: "store", name: "store"},
      {id: "subway_station", name: "subway_station"},
      {id: "surfing", name: "surfing"},
      {id: "swimming", name: "swimming"},
      {id: "synagogue", name: "synagogue"},
      {id: "taxi_stand", name: "taxi_stand"},
      {id: "tennis", name: "tennis"},
      {id: "toilet", name: "toilet"},
      {id: "trail_walking", name: "trail_walking"},
      {id: "train_station", name: "train_station"},
      {id: "transit_station", name: "transit_station"},
      {id: "travel_agency", name: "travel_agency"},
      {id: "unisex", name: "unisex"},
      {id: "university", name: "university"},
      {id: "veterinary_care", name: "veterinary_care"},
      {id: "viewing", name: "viewing"},
      {id: "volume_control_telephone", name: "volume_control_telephone"},
      {id: "walking", name: "walking"},
      {id: "waterskiing", name: "waterskiing"},
      {id: "whale_watching", name: "whale_watching"},
      {id: "wheelchair", name: "wheelchair"},
      {id: "wind_surfing", name: "wind_surfing"},
      {id: "zoo", name: "zoo"},
    ],
  },
};

FieldEnumSelector.propTypes = {
  control: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showHelp: PropTypes.bool,
  variant: PropTypes.string.isRequired,
};

export default function FieldEnumSelector({
  control,
  description,
  title,
  showHelp = true,
  variant,
}) {
  const items = ENUM_DEFINITIONS[variant].items;
  const label = `enum-label-${variant}`;

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
        fullWidth={true}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 2,
        }}
      >
        <InputLabel id={label}>{ENUM_DEFINITIONS[variant].name}</InputLabel>
        <Controller
          name={variant}
          control={control}
          render={({field}) => (
            <Select
              id={variant}
              variant="filled"
              label={ENUM_DEFINITIONS[variant].name}
              {...field}
              // DIG-1086 keeps react-hook-form happy about null values
              onChange={(event) => field.onChange(event.target.value || null)}
              value={field.value ?? ""} // DIG-1086 transforms nullish back to ""
            >
              <MenuItem value="">
                <em>Valitse yksi</em>
              </MenuItem>
              {items?.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </>
  );
}
