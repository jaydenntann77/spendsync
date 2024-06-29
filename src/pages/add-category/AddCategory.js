import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import styles from "./AddCategory.module.css";

export const AddCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("expense");
    const { userID } = useGetUserInfo();

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
    }, [userID]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!userID) return;

        const categoriesCollectionRef = collection(
            db,
            "users",
            userID,
            "categories"
        );
        await addDoc(categoriesCollectionRef, {
            name: newCategory,
            type: categoryType,
        });

        // Refresh categories list
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCategories(categoriesList);

        // Reset input
        setNewCategory("");
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!userID) return;

        const categoryDocRef = doc(
            db,
            "users",
            userID,
            "categories",
            categoryId
        );
        await deleteDoc(categoryDocRef);

        // Refresh categories list
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

    return (
        <div className={styles.addCategory}>
            <h1>Add a New Category</h1>
            <form onSubmit={handleAddCategory}>
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    required
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <div>
                    <input
                        type="radio"
                        id="expense"
                        value="expense"
                        checked={categoryType === "expense"}
                        onChange={(e) => setCategoryType(e.target.value)}
                    />
                    <label htmlFor="expense">Expense</label>
                    <input
                        type="radio"
                        id="income"
                        value="income"
                        checked={categoryType === "income"}
                        onChange={(e) => setCategoryType(e.target.value)}
                    />
                    <label htmlFor="income">Income</label>
                </div>
                <button type="submit">Add Category</button>
            </form>
            <button onClick={() => navigate("/add-transaction")}>
                Back to Add Transaction
            </button>
            <div>
                <h2>Existing Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            {category.name}
                            <button
                                onClick={() =>
                                    handleDeleteCategory(category.id)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
