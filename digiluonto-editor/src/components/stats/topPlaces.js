import groupBy from "lodash.groupby";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";

import TableSkeleton from "../pois/tableSkeleton";

import {useUser} from "../../hooks/user";
import {useMyTopPlaces} from "../../hooks/places";

const columns = [
  {id: "name", label: "Nimi", minWidth: 170},
  {id: "count", label: "Käyntejä", minWidth: 40, align: "right"},
];

export default function TopPlaces() {
  const {events, loading} = useMyTopPlaces();
  const {user} = useUser();

  if (loading) return <TableSkeleton columns={columns} />;

  const myPlaces = events.filter(
    e => e?.place?.ownerGroup?.id === user?.group?.id
  );
  const places = Object.entries(groupBy(myPlaces, e => e.place?.name));
  const topPlaces = places.map(j => j[1]).sort((a, b) => b.length - a.length);

  if (topPlaces?.length === 0) {
    return (
      <>
        <PlaceTitle />
        <Box sx={{maxWidth: "100%", margin: 2}}>
          <Typography variant="body2" sx={{mb: 2}}>
            Sinulla ei ole vielä yhtään paikkoihin liittyvää tapahtumaa.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <PlaceTitle />
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
              </TableRow>
            </TableHead>
            <TableBody>
              {topPlaces?.map((row, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`${row[0].id}-${i}`}
                  >
                    {columns.map(column => {
                      const value =
                        column.id === "name"
                          ? row[0]?.place?.name
                          : row?.length;
                      return (
                        <TableCell
                          key={`${column.id}-${row[0].id}`}
                          align={column.align}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

const PlaceTitle = () => {
  return (
    <Typography variant="h5" sx={{pt: 2, pb: 1, pl: 2, pr: 2}}>
      Suosituimmat paikat
    </Typography>
  );
};
