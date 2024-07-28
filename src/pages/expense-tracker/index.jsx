import React from "react";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { CategoryPieChart } from "../../components/Dashboard/CategoryPieChart";
import { IncomeExpenseBarChart } from "../../components/Dashboard/IncomeExpenseBarChart";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    Box,
    Button,
    useTheme,
    Avatar,
} from "@mui/material";
import { teal, amber } from "@mui/material/colors";
import styles from "./ExpenseTracker.module.css";

export const ExpenseTracker = () => {
    const { transactions, transactionTotal } = useGetTransactions();
    const { deleteTransaction } = useDeleteTransaction();
    const { name } = useGetUserInfo();
    const theme = useTheme();

    const { balance, income, expenses } = transactionTotal;

    const handleDelete = (transactionId) => {
        deleteTransaction(transactionId);
    };

    const barChartData = [
        { name: "Income", value: income },
        { name: "Expenses", value: expenses },
    ];

    const expenseByCategory = transactions.reduce((acc, transaction) => {
        if (transaction.transactionType === "expense") {
            const category = transaction.category;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += Number(transaction.transactionAmount);
        }
        return acc;
    }, {});

    const pieChartData = Object.keys(expenseByCategory).map((key) => ({
        name: key,
        value: expenseByCategory[key],
    }));

    return (
        <Container
            maxWidth="xl"
            sx={{ mt: 4, mb: 4, paddingTop: theme.spacing(8) }}
        >
            <Typography variant="h1" gutterBottom>
                {name}'s Expense Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ fontWeight: "bold" }}
                            >
                                Your Balance
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    color: balance >= 0 ? "green" : "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {balance >= 0 ? `$${balance}` : `-$${-balance}`}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper
                            elevation={3}
                            sx={{ p: 2, backgroundColor: teal[100] }}
                        >
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ color: "black", fontWeight: "bold" }}
                            >
                                Income
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{ color: "green", fontWeight: "bold" }}
                            >
                                ${income}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Paper
                            elevation={3}
                            sx={{ p: 2, backgroundColor: amber[100] }}
                        >
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ color: "black", fontWeight: "bold" }}
                            >
                                Expenses
                            </Typography>
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{ color: "red", fontWeight: "bold" }}
                            >
                                ${expenses}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <IncomeExpenseBarChart data={barChartData} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CategoryPieChart data={pieChartData} />
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h1" gutterBottom>
                            Transactions
                        </Typography>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Box>
                                {transactions.map((transaction) => {
                                    const {
                                        id,
                                        description,
                                        transactionAmount,
                                        transactionType,
                                        category,
                                    } = transaction;
                                    return (
                                        <Card
                                            key={id}
                                            sx={{
                                                mb: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                p: 2,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor:
                                                        transactionType ===
                                                        "expense"
                                                            ? "red"
                                                            : "green",
                                                    mr: 2,
                                                }}
                                            >
                                                <Typography variant="subtitle1">
                                                    {category[0]}
                                                </Typography>
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h4">
                                                    {description}
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    color="textSecondary"
                                                >
                                                    {category}
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        color:
                                                            transactionType ===
                                                            "expense"
                                                                ? "red"
                                                                : "#52b788",
                                                    }}
                                                >
                                                    ${transactionAmount}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDelete(id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                />
                                            </IconButton>
                                        </Card>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};
