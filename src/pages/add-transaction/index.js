import React from "react";
import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import styles from "../expense-tracker/ExpenseTracker.module.css";

export const AddTransaction = () => {
    const { addTransaction } = useAddTransaction();

    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("expense");

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
                    <h1>Add a Transaction!</h1>
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
                </div>
            </div>
        </>
    );
};
