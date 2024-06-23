import { db } from "../config/firebase-config";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
} from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";
import { arrayUnion } from "firebase/firestore";

export const useJoinGroup = () => {
    const { userID } = useGetUserInfo();

    const joinGroup = async (joinGroupID) => {
        try {
            const groupsRef = collection(db, "groups");
            const q = query(groupsRef, where("groupID", "==", joinGroupID));
            const groupSnapshot = await getDocs(q);
            if (!groupSnapshot.empty) {
                const groupDoc = groupSnapshot.docs[0];
                const groupRef = doc(db, "groups", groupDoc.id);
                await updateDoc(groupRef, {
                    members: arrayUnion(userID),
                });
            } else {
                alert("Group not found");
            }
        } catch (error) {
            console.error("Error joining group: ", error);
        }
    };

    return { joinGroup };
};
