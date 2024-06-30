import { useState } from "react";
import { db } from "../config/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

export const useDeleteTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userID } = useGetUserInfo();

    const deleteTransaction = async (transactionId) => {
        setLoading(true);
        try {
            if (!userID) {
                throw new Error("User ID is not available");
            }

            await deleteDoc(
                doc(db, "users", userID, "transactions", transactionId)
            );
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { deleteTransaction, loading, error };
};
