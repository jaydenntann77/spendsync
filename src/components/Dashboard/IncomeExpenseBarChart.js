import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell,
} from "recharts";

export const IncomeExpenseBarChart = ({ data }) => {
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis tickCount={4} interval={0} />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" minPointSize={5}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.name === "Income"
                                        ? "#82C09A"
                                        : "#B32D30"
                                }
                            />
                        ))}
                        <LabelList dataKey="value" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
