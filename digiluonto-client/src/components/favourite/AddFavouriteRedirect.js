import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useSettings } from "../settings/SettingsContext";

export const AddFavouriteRedirect = () => {
  const { updateSettings } = useSettings();

  useEffect(() => {
    updateSettings(prevState => ({
      ...prevState,
      favMode: !prevState.favMode,
    }));
  }, [updateSettings]);

  return <Redirect to="/map" />;
};
