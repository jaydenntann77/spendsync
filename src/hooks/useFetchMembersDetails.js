import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useFetchMembersDetails = (group) => {
    const [membersDetails, setMembersDetails] = useState([]);

    const fetchMembersDetails = useCallback(async () => {
        if (group && group.members) {
            try {
                const memberPromises = group.members.map(async (memberId) => {
                    const userRef = doc(db, "users", memberId);
                    const userDoc = await getDoc(userRef);
                    return userDoc.exists()
                        ? { id: memberId, ...userDoc.data() }
                        : null;
                });
                const members = await Promise.all(memberPromises);
                setMembersDetails(members.filter((member) => member !== null));
            } catch (err) {
                console.error("Error fetching member details:", err);
            }
        }
    }, [group]);

    useEffect(() => {
        fetchMembersDetails();
    }, [fetchMembersDetails]);

    return membersDetails;
};
