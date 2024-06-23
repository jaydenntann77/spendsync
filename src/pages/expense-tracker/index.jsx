import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useNavigate } from "react-router-dom";

import styles from "./ExpenseTracker.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";

export const ExpenseTracker = () => {
    const { transactions } = useGetTransactions();
    const { profilePhoto } = useGetUserInfo();
    const { deleteTransaction } = useDeleteTransaction();
    const navigate = useNavigate();

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
        </>
    );
};
