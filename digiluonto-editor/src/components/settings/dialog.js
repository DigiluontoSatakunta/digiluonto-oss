import {forwardRef} from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SettingsDialog({open, setOpen, showHelp, setShowHelp}) {
  const handleClose = () => setOpen(false);

  const onChange = () => setShowHelp(prev => !prev);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              ASETUKSET
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              SULJE
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{mt: 2, mb: 1}}>
                Lomakkeet
              </Typography>

              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={!!showHelp} onChange={onChange} />}
                  label="Näytä ohjetekstit lomakkeissa."
                />
              </FormGroup>
            </Box>
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
