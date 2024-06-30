import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const CategoryPieChart = ({ data }) => {
    return (
        <div style={{ textAlign: "center" }}>
            <h3>Expenses Category Distribution</h3>
            <PieChart width={500} height={500}>
                <Pie
                    data={data}
                    cx={250}
                    cy={250}
                    labelLine={false}
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};
