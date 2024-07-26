import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Box,
} from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const CategoryPieChart = ({ data }) => {
    return (
        <Card
            sx={{
                width: "60%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardHeader
                title={
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{ textAlign: "center" }}
                    >
                        Expenses Category Distribution
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
                    <PieChart width={500} height={300}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            labelLine={false}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
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
                </Box>
                <Table>
                    <TableBody>
                        {data.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: "1.2rem" }}
                                    >
                                        {entry.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: "1.2rem" }}
                                    >
                                        ${entry.value}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
