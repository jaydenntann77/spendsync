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
import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";

export const IncomeExpenseBarChart = ({ data }) => {
    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardHeader
                title={
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{ textAlign: "center" }}
                    >
                        Income and Expenses
                    </Typography>
                }
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexGrow: 1,
                    }}
                >
                    <div style={{ width: "100%", maxWidth: 800, height: 300 }}>
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
                                <YAxis
                                    tick={{ fill: "#ffffff", fontSize: 20 }}
                                    tickCount={4}
                                    interval={0}
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#ffffff", fontSize: 20 }}
                                />
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
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Box>
            </CardContent>
        </Card>
    );
};
