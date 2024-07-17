import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchGroupCurrency = (groupId) => {
    const [groupCurrency, setGroupCurrency] = useState("SGD"); // Default to SGD
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const groupDocRef = doc(db, "groups", groupId);

        const unsubscribe = onSnapshot(
            groupDocRef,
            (doc) => {
                if (doc.exists()) {
                    const newCurrency = doc.data().baseCurrency || "SGD";
                    setGroupCurrency(newCurrency);
                    console.log("Updated group currency:", newCurrency); // Log the new currency
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching group currency:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [groupId]);

    return { groupCurrency, setGroupCurrency, loading };
};
