import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddCategory.module.css";

export const AddCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("expense");

    useEffect(() => {
        // Fetch existing categories
        const fetchCategories = async () => {
            const response = await fetch("/api/categories");
            const data = await response.json();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();

        // Add new category
        await fetch("/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newCategory, type: categoryType }),
        });

        // Refresh categories list
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);

        // Reset input
        setNewCategory("");
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
            <button onClick={() => navigate("/add-transaction")}>Back to Add Transaction</button>
            <div>
                <h2>Existing Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
