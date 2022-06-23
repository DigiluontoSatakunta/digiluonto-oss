import React from "react";

export const Loading = () => {
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
      }}
    >
      <p>Loading...</p>
    </div>
  );
};
