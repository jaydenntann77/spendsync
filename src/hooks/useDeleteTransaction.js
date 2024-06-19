import { useState } from "react";
import { db } from "../config/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";

export const useDeleteTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteTransaction = async (transactionId) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "transactions", transactionId));
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { deleteTransaction, loading, error };
};
