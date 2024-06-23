import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import styles from "./GroupDetails.module.css";

export const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
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
        };

        fetchGroupDetails();
    }, [groupId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.groupDetails}>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <p>Members: {group.members.length}</p>
            <p>Group ID: {group.groupID}</p>
        </div>
    );
};
