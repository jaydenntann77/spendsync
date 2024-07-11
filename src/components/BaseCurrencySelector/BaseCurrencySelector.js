import React, { useState, useEffect } from "react";
import Select from "react-select";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";

export const BaseCurrencySelector = () => {
    const { userID, baseCurrency, isAuth } = useGetUserInfo();
    const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);

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

    const updateBaseCurrency = async (newCurrency) => {
        if (userID) {
            const userDocRef = doc(db, "users", userID);
            await updateDoc(userDocRef, {
                baseCurrency: newCurrency,
            });
            setSelectedCurrency(newCurrency);
        }
    };

    const currencyOptions = [
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" },
        { value: "GBP", label: "GBP" },
        { value: "JPY", label: "JPY" },
        { value: "AUD", label: "AUD" },
        { value: "CAD", label: "CAD" },
        { value: "CHF", label: "CHF" },
        { value: "CNY", label: "CNY" },
        { value: "SEK", label: "SEK" },
        { value: "NZD", label: "NZD" },
        { value: "MXN", label: "MXN" },
        { value: "SGD", label: "SGD" },
        { value: "HKD", label: "HKD" },
        { value: "NOK", label: "NOK" },
        { value: "KRW", label: "KRW" },
        { value: "TRY", label: "TRY" },
        { value: "RUB", label: "RUB" },
        { value: "INR", label: "INR" },
        { value: "BRL", label: "BRL" },
        { value: "ZAR", label: "ZAR" },
    ];

    if (!isAuth) return <div>Loading...</div>;

    return (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <Select
                value={{ value: selectedCurrency, label: selectedCurrency }}
                onChange={(selected) => updateBaseCurrency(selected.value)}
                options={currencyOptions}
            />
        </div>
    );
};
