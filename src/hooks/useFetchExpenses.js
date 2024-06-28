import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchExpenses = (groupId) => {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = useCallback(async () => {
        try {
            const expensesRef = collection(db, "groups", groupId, "expenses");
            const expensesSnapshot = await getDocs(expensesRef);
            const expensesList = expensesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExpenses(expensesList);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    }, [groupId]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return { expenses, fetchExpenses };
};
