import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

import TableActions from "./tableActions";
import TableSkeleton from "./tableSkeleton";
import styles from "../../../styles/Table.module.css";

import {useMyPlaces} from "../../hooks/places";

TablePlaces.propTypes = {
  activePoi: PropTypes.object,
  setActivePoi: PropTypes.func,
  setTabIndex: PropTypes.func,
};

const columns = [
  {id: "name", label: "Nimi", minWidth: 140},
  {id: "journey", label: "Polussa"},
  {id: "published_at", label: "Julkaistu", align: "center"},
];

export default function TablePlaces({activePoi, setActivePoi, setTabIndex}) {
  const {places, loading} = useMyPlaces();

  if (loading) return <TableSkeleton columns={columns} />;

  if (places?.length === 0) {
    return (
      <Box sx={{maxWidth: "100%", margin: 2}}>
        <Typography variant="body" gutterBottom component="div">
          Sinulla ei ole vielä yhtään paikkaa. Lisää ensimmäinen paikka
          klikkaamalla "Lisää uusi paikka" -nappia.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{maxWidth: "100%", overflow: "hidden"}}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{minWidth: column.minWidth}}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key="places-actions-header"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {places?.map(poi => (
              <MyTableRow
                key={poi.id}
                poi={poi}
                columns={columns}
                activePoi={activePoi}
                setActivePoi={setActivePoi}
                setTabIndex={setTabIndex}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const MyTableRow = ({poi, columns, activePoi, setActivePoi, setTabIndex}) => {
  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={poi.id}
      className={poi.id === activePoi?.id ? styles.activeRow : ""}
      onClick={() => setActivePoi(poi)}
    >
      {columns.map(column => {
        let value;
        switch (column.id) {
          case "name":
            value = poi?.name;
            break;
          case "published_at":
            value = poi?.published_at ? (
              <CheckIcon sx={{fontSize: "1.2em"}} />
            ) : (
              ""
            );
            break;
          case "journey":
            value = poi?.journeys?.map(journey => journey?.name).join(", ");
            break;
        }

        return (
          <TableCell
            key={column.id}
            align={column.align}
            className={`column-${column.id}`}
          >
            {column.format && typeof value === "number"
              ? column.format(value)
              : value}
          </TableCell>
        );
      })}
      <TableCell key="places-table-actions">
        <TableActions
          setTabIndex={setTabIndex}
          setActivePoi={setActivePoi}
          poi={poi}
        />
      </TableCell>
    </TableRow>
  );
};
