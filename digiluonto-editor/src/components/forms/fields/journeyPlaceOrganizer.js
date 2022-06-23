import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {useMyPlaces} from "../../../hooks/places";

FieldJourneyPlaceOrganizer.propTypes = {
  control: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default function FieldJourneyPlaceOrganizer({
  control,
  description,
  title,
}) {
  const {places, loading} = useMyPlaces();

  if (loading) return <></>;

  return (
    <Box
      sx={{
        margin: "16px -16px 0",
        padding: "0 16px 16px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h6" sx={{pt: 2, pb: 1}}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{pb: 2}}>
        {description}
      </Typography>

      <FormControl
        fullWidth={true}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 2,
        }}
      >
        <Controller
          name="places"
          control={control}
          render={({field: {value, onChange}}) => (
            <List sx={{display: "flex", flexDirection: "column", gap: 1}}>
              {places?.map(place => (
                <MyListItem
                  key={place.id}
                  journey={value}
                  setJourney={onChange}
                  place={place}
                />
              ))}
            </List>
          )}
        />
      </FormControl>
    </Box>
  );
}

function MyListItem({journey, setJourney, place}) {
  const labelId = `checkbox-list-label-${place.id}`;
  const key = `list-journey-organizer-${place.id}`;
  const placeInJourneyIndex = journey.findIndex(item => item === place.id);
  const itemsInJourney = journey.length;

  return (
    <Paper
      sx={{
        order:
          placeInJourneyIndex !== -1 ? placeInJourneyIndex : itemsInJourney + 1,
      }}
    >
      <ListItem
        disablePadding
        key={key}
        secondaryAction={
          placeInJourneyIndex >= 0 && (
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical contained button group"
              variant="contained"
              sx={{mr: -1, gap: "1px"}}
            >
              <Button
                key="decrease"
                onClick={() =>
                  reorderJourney(journey, setJourney, place.id, -1)
                }
                disabled={placeInJourneyIndex === 0}
              >
                <KeyboardArrowUpIcon sx={{fontSize: "0.9em"}} />
              </Button>
              <Button
                key="increase"
                onClick={() =>
                  reorderJourney(journey, setJourney, place.id, +1)
                }
                disabled={placeInJourneyIndex + 1 === itemsInJourney}
              >
                <KeyboardArrowDownIcon sx={{fontSize: "0.9em"}} />
              </Button>
            </ButtonGroup>
          )
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={placeInJourneyIndex >= 0}
              tabIndex={-1}
              disableRipple
              inputProps={{"aria-labelledby": labelId}}
              onClick={() =>
                reorderJourney(journey, setJourney, place.id, 0)
              }
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={place?.name} />
        </ListItemButton>
      </ListItem>
    </Paper>
  );
}

function reorderJourney(journey, setJourney, item, direction) {
  const oldIndex = journey.indexOf(item);
  // construct a new array without the item
  let newJourney = journey?.filter(j => j !== item);

  if (oldIndex < 0) {
    // item is new, add it
    newJourney.push(item); // adds a new item to the last position
  } else {
    // item was already in the array, modify it
    if (direction === 0) {
      // item needs to be deleted
      // item will be deleted from the array, nothing to do
    } else {
      // move item to desired direction
      newJourney.splice(oldIndex + direction, 0, item);
    }
  }
  setJourney(newJourney);
}
