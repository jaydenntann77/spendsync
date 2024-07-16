import { db } from "../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

// Function to generate a unique alphanumeric ID
const generateUniqueID = () => {
    return Math.random().toString(36).substr(2, 7);
};

export const useCreateGroup = () => {
    const { userID, baseCurrency: userBaseCurrency } = useGetUserInfo(); // Fetch user's base currency

    const createGroup = async (name, description) => {
        const groupID = generateUniqueID();
        const defaultGroupBaseCurrency = userBaseCurrency || "SGD"; // Set default base currency for the group

        try {
            const groupRef = collection(db, "groups");
            await addDoc(groupRef, {
                name,
                description,
                members: [userID],
                groupID,
                baseCurrency: defaultGroupBaseCurrency, // Add base currency to the group
            });
        } catch (error) {
            console.error("Error creating group: ", error);
        }
    };

    return { createGroup };
};
