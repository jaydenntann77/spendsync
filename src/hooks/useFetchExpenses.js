import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchExpenses = (groupId, refreshKey) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = useCallback(async () => {
        try {
            const expensesRef = collection(db, "groups", groupId, "expenses");
            const expensesSnapshot = await getDocs(expensesRef);
            const expensesList = expensesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExpenses(expensesList);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    }, [groupId]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses, refreshKey]); // Add refreshKey as a dependency

    return { expenses, fetchExpenses, loading };
};
