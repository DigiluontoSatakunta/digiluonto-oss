import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TableJourneys from "./tableJourneys";
import TablePlaces from "./tablePlaces";

export default function Pois({setActivePoi, activePoi, setTabIndex}) {
  return (
    <Box>
      <Typography variant="h5" sx={{pt: 2, pb: 1, pl: 2, pr: 2}}>
        Omat polut
      </Typography>
      <TableJourneys
        activePoi={activePoi}
        setActivePoi={setActivePoi}
        setTabIndex={setTabIndex}
      />

      <Typography variant="h5" sx={{pt: 3, pl: 2, pr: 2}}>
        Omat paikat
      </Typography>
      <TablePlaces
        activePoi={activePoi}
        setActivePoi={setActivePoi}
        setTabIndex={setTabIndex}
      />
    </Box>
  );
}
