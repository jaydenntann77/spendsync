import { useState, useEffect, useCallback } from "react";
import { db } from "../config/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

export const useFetchUserGroups = () => {
    const [userGroups, setUserGroups] = useState([]);
    const { userID } = useGetUserInfo();

    const fetchUserGroups = useCallback(async () => {
        if (!userID) return;
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("members", "array-contains", userID));
        const groupSnapshot = await getDocs(q);
        const groupList = groupSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUserGroups(groupList);
    }, [userID]);

    useEffect(() => {
        fetchUserGroups();
    }, [fetchUserGroups]);

    return { userGroups, fetchUserGroups };
};
