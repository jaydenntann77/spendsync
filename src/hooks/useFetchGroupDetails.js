import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchGroupDetails = (groupId) => {
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);

    const fetchGroupDetails = useCallback(async () => {
        try {
            const groupRef = doc(db, "groups", groupId);
            const groupDoc = await getDoc(groupRef);
            if (groupDoc.exists()) {
                setGroup(groupDoc.data());
            } else {
                console.error("Group not found");
                setError("Group not found");
            }
        } catch (err) {
            console.error("Error fetching group details:", err);
            setError("Error fetching group details");
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    return { group, error };
};
