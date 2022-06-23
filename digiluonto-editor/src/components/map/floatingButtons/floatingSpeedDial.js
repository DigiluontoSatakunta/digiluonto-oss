import Fab from "@mui/material/Fab";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const actions = [
  {icon: <AddRoadIcon />, name: "Lisää uusi polku", index: 3},
  {icon: <AddLocationAltIcon />, name: "Lisää uusi paikka", index: 2},
];

const FloatingSpeedDial = ({
  setTabIndex,
  setIsDrawerOpen,
  setActivePoi,
  markerEditMode,
}) => {
  const handleClick = index => {
    setActivePoi(null);
    setTabIndex(index);
    setIsDrawerOpen(true);
  };

  return (
    <>
      {!markerEditMode ? (
        <SpeedDial ariaLabel="Pikavalinnat" icon={<SpeedDialIcon />}>
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                handleClick(action.index);
              }}
            />
          ))}
        </SpeedDial>
      ) : (
        <Fab disabled={true} color="primary" aria-label="Pikavalinnat">
          <SpeedDialIcon />
        </Fab>
      )}
    </>
  );
};

export default FloatingSpeedDial;
