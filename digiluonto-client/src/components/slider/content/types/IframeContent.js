import React from "react";
import { useTranslation } from "react-i18next";
import { Close } from "@material-ui/icons";

import {
  makeStyles,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  LinkContent: {
    display: "grid",
    padding: theme.spacing(1),
    gridTemplateColumns: "1fr",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogContent: {
    display: "flex",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
  },
  iframe: {
    border: 0,
    minWidth: "100%",
  },
}));

export const IframeContent = ({ link }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const fullScreen = true;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.LinkContent}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        className={classes.iframeButton}
        title={link?.url}
      >
        {link?.name || t("Open")}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        className={classes.iframeDialog}
        open={open}
        onClose={handleClose}
        style={{ zIndex: 1600 }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t("External content")}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <iframe
            referrerPolicy="no-referrer"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
            className={classes.iframe}
            src={link?.url}
            title={t("External content")}
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};
