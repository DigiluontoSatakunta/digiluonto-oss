import React from "react";
import { useTranslation } from "react-i18next";

export const AllowLocation = () => {
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
        zIndex: "10",
      }}
    >
      <p>{t("Allow location to use this application. Location can be allowed in browser settings if you denied it.")}</p>
    </div>
  );
};
