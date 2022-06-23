import Fab from "@mui/material/Fab";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

export default function FloatingEditButton({
  activePoi,
  setTabIndex,
  setIsDrawerOpen,
  markerEditMode,
}) {
  function handleClick() {
    setIsDrawerOpen(true);
    setTabIndex(activePoi?.__typename === "Place" ? 2 : 3);
  }

  return (
    <Fab
      onClick={handleClick}
      disabled={markerEditMode}
      color="primary"
      aria-label="muokkaa kohdetta"
    >
      <EditLocationAltIcon />
    </Fab>
  );
}
