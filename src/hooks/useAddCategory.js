import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddCategory = () => {
    const { userID } = useGetUserInfo();
    const addCategory = async ({ name, type }) => {
        const categoryCollectionRef = collection(
            db,
            "users",
            userID,
            "categories"
        );
        await addDoc(categoryCollectionRef, {
            name,
            type,
        });
    };
    return { addCategory };
};
