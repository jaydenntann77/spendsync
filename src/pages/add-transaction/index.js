import React from "react";
import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useNavigate } from "react-router-dom";
import styles from "../expense-tracker/ExpenseTracker.module.css";

export const AddTransaction = () => {
    const { addTransaction } = useAddTransaction();
    const { transactions, transactionTotal } = useGetTransactions();
    const { name, profilePhoto } = useGetUserInfo();
    const { deleteTransaction } = useDeleteTransaction();
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("expense");

    const { balance, income, expenses } = transactionTotal;

    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction({ description, transactionAmount, transactionType });

        // useState that resets the form inputs to be blank after pressing submit
        setDescription("");
        setTransactionAmount("");
    };

    return (
        <>
            <div className={styles.expenseTracker}>
                <div className={styles.container}>
                    <h1>{name}'s Expense Tracker</h1>

                    <div className={styles.balance}>
                        <h3>Your Balance</h3>
                        {balance >= 0 ? (
                            <h2>${balance}</h2>
                        ) : (
                            <h2>-${-balance}</h2>
                        )}
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
                    <form className={styles.addTransaction} onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            required
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={transactionAmount}
                            required
                            onChange={(e) =>
                                setTransactionAmount(e.target.value)
                            }
                        />
                        <div>
                            <input
                                type="radio"
                                id="expense"
                                value="expense"
                                checked={transactionType === "expense"}
                                onChange={(e) =>
                                    setTransactionType(e.target.value)
                                }
                            />
                            <label htmlFor="expense">Expense</label>
                            <input
                                type="radio"
                                id="income"
                                value="income"
                                checked={transactionType === "income"}
                                onChange={(e) =>
                                    setTransactionType(e.target.value)
                                }
                            />
                            <label htmlFor="income">Income</label>
                        </div>
                        <button type="submit">Add Transaction</button>
                    </form>
                    {profilePhoto && (
                        <div className={styles.profile}>
                            <img
                                className={styles.profilePhoto}
                                src={profilePhoto}
                                alt="Profile"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
