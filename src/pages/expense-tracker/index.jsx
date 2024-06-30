import React from "react";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import styles from "./ExpenseTracker.module.css";
import "../../App.css";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { CategoryPieChart } from "../../components/Dashboard/CategoryPieChart";
import { IncomeExpenseBarChart } from "../../components/Dashboard/IncomeExpenseBarChart";

export const ExpenseTracker = () => {
    const { transactions, transactionTotal } = useGetTransactions();
    const { deleteTransaction } = useDeleteTransaction();
    const { name } = useGetUserInfo();

    const { balance, income, expenses } = transactionTotal;

    const handleDelete = (transactionId) => {
        deleteTransaction(transactionId);
    };

    //prepare data for bar chart
    const barChartData = [
        { name: "Income", value: income },
        { name: "Expenses", value: expenses },
    ];

    // Prepare data for pie chart
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
        <div className={styles.expenseTracker}>
            <div className={styles.container}>
                <h1>{name}'s Expense Tracker</h1>

                <div className={styles.balance}>
                    <h2>Your Balance</h2>
                    {balance >= 0 ? <h2>${balance}</h2> : <h2>-${-balance}</h2>}
                </div>

                <div className={styles.summary}>
                    <div className={styles.income}>
                        <h4>Income</h4>
                        <p>${income}</p>
                    </div>
                    <div className={styles.expenses}>
                        <h4>Expenses</h4>
                        <p>${expenses}</p>
                    </div>
                </div>

                <IncomeExpenseBarChart data={barChartData} />
                <CategoryPieChart data={pieChartData} />
            </div>
            <div className={styles.transactions}>
                <h1>Transactions</h1>
                <ul>
                    {transactions.map((transaction) => {
                        const {
                            id,
                            description,
                            transactionAmount,
                            transactionType,
                            category, // Add category field
                        } = transaction;

                        return (
                            <li key={id}>
                                <h4>{description}</h4>
                                <p>
                                    ${transactionAmount} |{" "}
                                    <label
                                        style={{
                                            color:
                                                transactionType === "expense"
                                                    ? "red"
                                                    : "green",
                                        }}
                                    >
                                        {transactionType}
                                    </label>{" "}
                                    | <span>{category}</span>{" "}
                                    {/* Display category */}
                                </p>
                                <button onClick={() => handleDelete(id)}>
                                    Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
