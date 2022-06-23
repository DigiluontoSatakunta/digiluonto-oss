import React from "react";
import { useTranslation } from "react-i18next";

export const AllowCamera = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#212121",
        color: "#ffc107",
        padding: "25px",
      }}
    >
      <p>{t("Allow the camera to be used in the browser settings and reload the page")}</p>
    </div>
  );
};
