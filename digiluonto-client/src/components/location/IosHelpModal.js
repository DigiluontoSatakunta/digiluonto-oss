import React from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function IosHelpModal({ openHelpModal, setOpenHelpModal }) {
  const { t } = useTranslation();
  const handleClose = () => {
    setOpenHelpModal(false);
  };

  return (
    <Dialog
      open={openHelpModal}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("Allow location on iOS guide")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("Open your iOSs Settings app")}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
