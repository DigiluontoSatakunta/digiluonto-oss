import {createTheme} from "@mui/material/styles";
import {red} from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: red[500],
    },
    secondary: {
      main: red[800],
    },
  },
});

export default lightTheme;
