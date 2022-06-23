import React from "react";
import QrReader from "react-qr-reader";
import { useHistory, useParams } from "react-router-dom";
import { useGroup } from "../group/GroupContext";

export const QrCamera = () => {
  const history = useHistory();
  const { id, token } = useParams();
  const group = useGroup();
  const handleError = err => {
    console.log(err);
  };
  console.log(group);
  const visitedPlaces = JSON.parse(
    localStorage.getItem("visitedPlaces") || "[]"
  );

  const usedTokens = JSON.parse(localStorage.getItem("usedTokens") || "[]");

  const handleScan = data => {
    if (data && id) {
      visitedPlaces.push(id);
      usedTokens.push(token);
      localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
      localStorage.setItem("usedTokens", JSON.stringify(usedTokens));

      if (data.includes("digiluonto")) window.open(`${data}`, "_self");
      else {
        history.push(`/places/${id}`);
      }
    }
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
    </div>
  );
};
