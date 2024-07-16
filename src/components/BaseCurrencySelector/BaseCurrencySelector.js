import React from "react";
import Select from "react-select";
import {
    updateDoc,
    doc,
    getDoc,
    collection,
    getDocs,
    runTransaction,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useFetchGroupCurrency } from "../../hooks/useFetchGroupCurrency";
import { useParams } from "react-router-dom";
import { useFetchExchangeRates } from "../../hooks/useFetchExchangeRates";

export const BaseCurrencySelector = ({ onUpdateBaseCurrency }) => {
    const { groupId } = useParams(); // Get the groupId from the URL
    const { groupCurrency, setGroupCurrency, loading } =
        useFetchGroupCurrency(groupId);
    const { exchangeRates } = useFetchExchangeRates();

    const updateBaseCurrency = async (newCurrency) => {
        if (groupId) {
            const groupDocRef = doc(db, "groups", groupId);
            const groupDoc = await getDoc(groupDocRef);

            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                const oldCurrency = groupData.baseCurrency;
                const rateToUSD = exchangeRates[oldCurrency];
                const rateFromNewBase = exchangeRates[newCurrency];

                const balancesRef = collection(
                    db,
                    "groups",
                    groupId,
                    "balances"
                );
                const expensesRef = collection(
                    db,
                    "groups",
                    groupId,
                    "expenses"
                );

                await runTransaction(db, async (transaction) => {
                    const balancesSnapshot = await getDocs(balancesRef);
                    const expensesSnapshot = await getDocs(expensesRef);

                    balancesSnapshot.forEach((balanceDoc) => {
                        const balanceData = balanceDoc.data();
                        const convertedAmount =
                            (balanceData.amount / rateToUSD) * rateFromNewBase;
                        transaction.update(balanceDoc.ref, {
                            amount: convertedAmount,
                        });
                    });

                    expensesSnapshot.forEach((expenseDoc) => {
                        const expenseData = expenseDoc.data();
                        const convertedAmount =
                            (expenseData.amount / rateToUSD) * rateFromNewBase;
                        transaction.update(expenseDoc.ref, {
                            amount: convertedAmount,
                        });
                    });

                    transaction.update(groupDocRef, {
                        baseCurrency: newCurrency,
                    });
                });

                setGroupCurrency(newCurrency);
                if (onUpdateBaseCurrency) onUpdateBaseCurrency(newCurrency);
            }
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

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <Select
                value={{ value: groupCurrency, label: groupCurrency }}
                onChange={(selected) => updateBaseCurrency(selected.value)}
                options={currencyOptions}
            />
        </div>
    );
};
