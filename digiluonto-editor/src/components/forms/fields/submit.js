import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import styles from "../../../../styles/Forms.module.css";

FieldSubmitController.propTypes = {
  handleCancel: PropTypes.func,
  submittingForm: PropTypes.bool,
  submitButtonText: PropTypes.string,
  isDirty: PropTypes.bool,
};

export default function FieldSubmitController({
  handleCancel,
  submitButtonText,
  isSubmitting,
  isDirty,
}) {
  return (
    <Box className={styles.fieldSubmitController}>
      <Button variant="outlined" onClick={handleCancel} size="medium">
        Peruuta
      </Button>
      <LoadingButton
        disabled={!isDirty}
        loading={isSubmitting}
        variant="contained"
        size="medium"
        type="submit"
      >
        {submitButtonText || "Tallenna"}
      </LoadingButton>
    </Box>
  );
}
