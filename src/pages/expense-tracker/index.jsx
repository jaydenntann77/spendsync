import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useNavigate } from "react-router-dom";

import styles from "./ExpenseTracker.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";

export const ExpenseTracker = () => {
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

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // clears local storage after signing out
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (transactionId) => {
        deleteTransaction(transactionId);
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
                            <button
                                className={styles.signOutButton}
                                onClick={signUserOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
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
                                <li key={transaction.id}>
                                    <h4>{description}</h4>
                                    <p>
                                        ${transactionAmount} |{" "}
                                        <label
                                            style={{
                                                color:
                                                    transactionType ===
                                                    "expense"
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
        </>
    );
};
