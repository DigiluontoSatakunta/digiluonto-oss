import * as React from "react";
import groupBy from "lodash.groupby";
import findLastIndex from "lodash.findlastindex";

import RechartsBar from "./charts/bar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import {useSiteData} from "../hooks/data";
import {median} from "../utility/math";

export const Chart = props => {
  const {data, loading, error} = useSiteData(props);

  if (loading)
    return (
      <Box
        sx={{
          height: "260px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error) return <div>error...</div>;

  const firstIndexOf = data?.findIndex(d => typeof d.counts === "number");
  const lastIndexOf = findLastIndex(data, d => typeof d.counts === "number");
  const filteredData = data?.slice(firstIndexOf, lastIndexOf + 1);

  const groupedByYear = data => {
    return data?.map(d => {
      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        year: "numeric",
      });
      return {label, ...d};
    });
  };

  const groupedByDay = data => {
    const grouped = data?.map(d => {
      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        weekday: "short",
      });
      const dayNumber = new Date(d.isoDate).getDay();
      const order = dayNumber === 0 ? 7 : dayNumber;

      return {label, order, ...d};
    });

    const groupedByDays = Object.entries(groupBy(grouped, "order"));

    return groupedByDays
      ?.map(day => {
        return {
          label: day[1][0]?.label,
          counts: median(day[1]?.filter(d => d?.counts > 0).map(d => d.counts)),
        };
      })
      .sort((a, b) => a.label - b.label);
  };

  const groupedByMonth = data => {
    const grouped = data?.map(d => {
      const order = new Date(d.isoDate).toLocaleString("fi-FI", {
        month: "numeric",
      });

      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        month: "short",
      });

      return {label, order, ...d};
    });

    const groupedByMonths = Object.entries(groupBy(grouped, "order"));

    return groupedByMonths
      ?.map(month => {
        return {
          label: month[1][0]?.order, // väliaikainen hack, kkn nimilyhenne tähäh
          order: month[1][0]?.order,
          counts: median(
            month[1]?.filter(m => m?.counts > 0).map(m => m.counts)
          ),
        };
      })
      .sort((a, b) => a.order - b.order);
  };

  const groupedData =
    props.step === "year"
      ? groupedByYear(filteredData)
      : props.step === "month"
      ? groupedByMonth(filteredData)
      : props.step === "day"
      ? groupedByDay(filteredData)
      : filteredData;

  return <RechartsBar data={groupedData} />;
};
