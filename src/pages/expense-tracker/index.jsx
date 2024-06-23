import React from "react";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import styles from "./ExpenseTracker.module.css";

export const ExpenseTracker = () => {
    const { transactions } = useGetTransactions();
    const { deleteTransaction } = useDeleteTransaction();

    const handleDelete = (transactionId) => {
        deleteTransaction(transactionId);
    };

    return (
        <div className={styles.expenseTracker}>
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
                            <li key={transaction.id}>
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
