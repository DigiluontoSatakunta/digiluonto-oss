import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getPathLength, convertDistance } from "geolib";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    backgroundColor: "#fafafa",
    maxWidth: "100%",
    width: "100%",
  },
});

export const JourneyInfoTable = ({ journey }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const memoizedRouteLength = useMemo(() => {
    const coordinates = journey?.places?.map(
      place => place.geoJSON?.geometry?.coordinates
    );
    return Array.isArray(coordinates) && coordinates.length
      ? getPathLength(coordinates)
      : 0;
  }, [journey]);

  const routeLength = journey?.calculateDistance
    ? memoizedRouteLength
    : journey?.distance;

  const rows = [
    { name: "groupSize", value: t(journey?.groupSize) },
    { name: "targetGroup", value: t(journey?.targetGroup) },
    { name: "difficulty", value: t(journey?.difficulty) },
    { name: "category", value: t(journey?.category) },
    { name: "duration", value: journey?.duration },
    { name: "distance", value: routeLength },
    { name: "elevation", value: journey?.elevation },
    { name: "accessibility", value: t(journey?.accessibility) },
    { name: "authorGroup", value: journey?.ownerGroup.name },
  ];

  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        size="small"
        aria-label="info about journey"
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 600 }}>{t("Infobox")}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <InfoRow row={row} key={row.name} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const InfoRow = ({ row }) => {
  const { t } = useTranslation();

  let value = row.value;

  const time2hours = value => {
    var hours = Math.floor(value / 60);
    var minutes = value % 60;
    return `${hours}${minutes > 0 ? ":" + minutes : ""} ${t("h")}`;
  };

  if (row.name === "duration" && row.value) value = `${time2hours(row.value)} `;
  if (row.name === "distance" && row.value)
    value =
      row.value >= 600
        ? `${parseFloat(convertDistance(row.value, "km")).toFixed(1)} km`
        : `${row.value} m`;
  if (row.name === "elevation" && row.value) value = `${row.value} m`;
  if (row.value) {
    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {t(row.name)}
        </TableCell>
        <TableCell align="right">{value}</TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
};
