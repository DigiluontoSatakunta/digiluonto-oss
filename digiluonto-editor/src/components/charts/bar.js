import React, {PureComponent} from "react";
import Box from "@mui/material/Box";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default class RechartsBar extends PureComponent {
  render() {
    return (
      <Box
        sx={{
          width: "100%",
          height: 260,
          margin: 0,
        }}
        component="figure"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={300}
            height={150}
            data={this.props?.data || []}
            style={{fontSize: "12px"}}
          >
            <YAxis
              label={{
                value: "ulkoilijoita",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="counts" fill="#4caf50">
              <LabelList dataKey="label" position="bottom" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
