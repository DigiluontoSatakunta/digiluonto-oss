import React, { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useSettings } from "../settings/SettingsContext";

export const AddPreviewModeRedirect = () => {
  const { updateSettings } = useSettings();
  const { id } = useParams();

  useEffect(() => {
    updateSettings(prevState => ({
      ...prevState,
      previewMode: !prevState.previewMode,
    }));
  }, [updateSettings]);

  return <Redirect to={`/journeys/${id}`} />;
};
