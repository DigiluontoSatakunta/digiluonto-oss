import React, { memo } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { MapIcon } from "../icons/MapIcon";
import { useTranslation } from "react-i18next";

export const RouteInfo = memo(({ geoJsonInfo }) => {
  const { t } = useTranslation();
  return (
    <LayerGroup>
      <Marker
        icon={MapIcon("search", "greenIcon")}
        position={geoJsonInfo.position}
      >
        <Popup>
          <div style={{ padding: "0px 10px 0px 10px" }}>
            <h2 style={{ textAlign: "center" }}>{t("Route info")}</h2>
            <p>
              {t("The highest point ")} {geoJsonInfo.highestAlt}m
            </p>
            <p>
              {t("The lowest point ")} {geoJsonInfo.lowestAlt}m
            </p>
            <p>
              {t("Height difference ")}
              {geoJsonInfo.heightDifference.toFixed(2)}m
            </p>
          </div>
        </Popup>
      </Marker>
    </LayerGroup>
  );
});
