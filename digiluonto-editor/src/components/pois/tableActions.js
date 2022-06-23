import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";

export default function TableActions({setTabIndex, setActivePoi, poi}) {
  const handleEdit = () => {
    switch (poi?.__typename) {
      case "Journey": setTabIndex(3); break;
      case "Place": setTabIndex(2); break;
      default: return;
    }
    setActivePoi(poi);
  };

  return (
    <Stack direction="row" spacing={0} sx={{justifyContent: "flex-end"}}>
      <IconButton
        aria-label="muokkaa"
        size="small"
        sx={{padding: 0}}
        onClick={handleEdit}
      >
        <EditIcon fontSize="small" sx={{w: 2, h: 2}} />
      </IconButton>
    </Stack>
  );
}
