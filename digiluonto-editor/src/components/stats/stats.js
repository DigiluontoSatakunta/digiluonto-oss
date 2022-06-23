import Box from "@mui/material/Box";

import TopJourneys from "./topJourneys";
import TopPlaces from "./topPlaces";

export default function Stats() {
  return (
    <Box>
      <Box sx={{pb: 2}}>
        <TopJourneys />
      </Box>
      <Box>
        <TopPlaces />
      </Box>
    </Box>
  );
}
