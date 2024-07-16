import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useFetchUserCurrency = () => {
    const { userID } = useGetUserInfo();
    const [selectedCurrency, setSelectedCurrency] = useState("SGD");

    useEffect(() => {
        const fetchUserCurrency = async () => {
            if (userID) {
                const userDoc = await getDoc(doc(db, "users", userID));
                if (userDoc.exists()) {
                    setSelectedCurrency(userDoc.data().baseCurrency || "SGD");
                }
            }
        };

        fetchUserCurrency();
    }, [userID]);

    return [selectedCurrency, setSelectedCurrency];
};
