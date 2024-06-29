import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
    const { userID } = useGetUserInfo();

    const addTransaction = async ({
        description,
        transactionAmount,
        transactionType,
        category,
    }) => {
        const transactionCollectionRef = collection(
            db,
            "users",
            userID,
            "transactions"
        );

        await addDoc(transactionCollectionRef, {
            description,
            transactionAmount,
            transactionType,
            createdAt: serverTimestamp(),
            category,
        });
    };

    return { addTransaction };
};
