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

import {useMyJourneys} from "../../hooks/journeys";

TableJourneys.propTypes = {
  activePoi: PropTypes.object,
  setActivePoi: PropTypes.func,
  setTabIndex: PropTypes.func,
};

const columns = [
  {id: "name", label: "Nimi", minWidth: 140},
  {id: "places", label: "Paikat", align: "center"},
  {id: "published_at", label: "Julkaistu", align: "center"},
];

export default function TableJourneys({activePoi, setActivePoi, setTabIndex}) {
  const {journeys, loading} = useMyJourneys();

  if (loading) return <TableSkeleton columns={columns} />;

  if (journeys?.length === 0) {
    return (
      <Box sx={{maxWidth: "100%", margin: 2}}>
        <Typography variant="body" gutterBottom component="div">
          Sinulla ei ole vielä yhtään polkua. Lisää ensimmäinen polku
          klikkaamalla "Lisää uusi polku" -nappia.
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
              <TableCell key="journeys-actions-header"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journeys?.map(row => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                  className={row.id === activePoi?.id ? styles.activeRow : ""}
                  onClick={() => setActivePoi(row)}
                >
                  {columns.map(column => {
                    let value;
                    switch (column.id) {
                      case "name":
                        value = row?.name;
                        break;
                      case "published_at":
                        value = row?.published_at ? (
                          <CheckIcon sx={{fontSize: "1.2em"}} />
                        ) : (
                          ""
                        );
                        break;
                      case "places":
                        value = row?.places?.length;
                        break;
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                  <TableCell key="journeys-table-actions">
                    <TableActions
                      setTabIndex={setTabIndex}
                      setActivePoi={setActivePoi}
                      poi={row}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
