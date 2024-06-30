import React from "react";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import styles from "./ExpenseTracker.module.css";
import "../../App.css";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";

export const ExpenseTracker = () => {
    const { transactions, transactionTotal } = useGetTransactions();
    const { deleteTransaction } = useDeleteTransaction();
    const { name } = useGetUserInfo();

    const { balance, income, expenses } = transactionTotal;

    const handleDelete = (transactionId) => {
        deleteTransaction(transactionId);
    };

    return (
        <div className={styles.expenseTracker}>
            <div className={styles.container}>
                <h1>{name}'s Expense Tracker</h1>

                <div className={styles.balance}>
                    <h3>Your Balance</h3>
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
            </div>
            <div className={styles.transactions}>
                <h3>Transactions</h3>
                <ul>
                    {transactions.map((transaction) => {
                        const {
                            id,
                            description,
                            transactionAmount,
                            transactionType,
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
                                        {transactionType}{" "}
                                    </label>
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
