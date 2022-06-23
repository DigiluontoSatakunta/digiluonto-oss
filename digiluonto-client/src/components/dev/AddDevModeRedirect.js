import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useSettings } from "../settings/SettingsContext";

export const AddDevModeRedirect = () => {
  const { updateSettings } = useSettings();

  useEffect(() => {
    updateSettings(prevState => ({
      ...prevState,
      devMode: !prevState.devMode,
    }));
  }, [updateSettings]);

  localStorage.setItem("devmode", true);

  return <Redirect to="/" />;
};
