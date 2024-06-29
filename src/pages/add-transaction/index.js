import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import styles from "../expense-tracker/ExpenseTracker.module.css";

export const AddTransaction = () => {
    const { addTransaction } = useAddTransaction();
    const navigate = useNavigate();
    const { userID } = useGetUserInfo();

    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("expense");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        if (!userID) return;

        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(
                db,
                "users",
                userID,
                "categories"
            );
            const categoriesSnapshot = await getDocs(categoriesCollectionRef);
            const categoriesList = categoriesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesList);
        };

        fetchCategories();
    }, [userID, transactionType]); // Depend on userID and transactionType

    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction({
            description,
            transactionAmount,
            transactionType,
            category: selectedCategory,
        });

        // Reset form inputs after submitting
        setDescription("");
        setTransactionAmount(0);
        setSelectedCategory("");
    };

    return (
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
                        onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                    <div>
                        <input
                            type="radio"
                            id="expense"
                            value="expense"
                            checked={transactionType === "expense"}
                            onChange={(e) => setTransactionType(e.target.value)}
                        />
                        <label htmlFor="expense">Expense</label>
                        <input
                            type="radio"
                            id="income"
                            value="income"
                            checked={transactionType === "income"}
                            onChange={(e) => setTransactionType(e.target.value)}
                        />
                        <label htmlFor="income">Income</label>
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => navigate("/add-category")}
                        >
                            Add Category
                        </button>
                    </div>
                    <button type="submit">Add Transaction</button>
                </form>
            </div>
        </div>
    );
};
