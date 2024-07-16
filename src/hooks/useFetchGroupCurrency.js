import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchGroupCurrency = (groupId) => {
    const [groupCurrency, setGroupCurrency] = useState("SGD"); // Default to SGD
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupCurrency = async () => {
            try {
                const groupDoc = await getDoc(doc(db, "groups", groupId));
                if (groupDoc.exists()) {
                    setGroupCurrency(groupDoc.data().baseCurrency || "SGD");
                }
            } catch (error) {
                console.error("Error fetching group currency:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupCurrency();
    }, [groupId]);

    return { groupCurrency, setGroupCurrency, loading };
};
