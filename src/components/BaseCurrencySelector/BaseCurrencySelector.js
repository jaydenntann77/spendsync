import React from "react";
import { useParams } from "react-router-dom";
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
import { useFetchExchangeRates } from "../../hooks/useFetchExchangeRates";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
} from "@mui/material";

export const BaseCurrencySelector = ({ onUpdateBaseCurrency }) => {
    const { groupId } = useParams(); // Get the groupId from the URL
    const { groupCurrency, setGroupCurrency, loading } =
        useFetchGroupCurrency(groupId);
    const { exchangeRates } = useFetchExchangeRates();

    const updateBaseCurrency = async (newCurrency) => {
        if (groupId) {
            console.log("Updating base currency to:", newCurrency);
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

                        // Convert manual splits
                        const convertedManualSplits = {};
                        if (expenseData.manualSplits) {
                            Object.keys(expenseData.manualSplits).forEach(
                                (member) => {
                                    convertedManualSplits[member] =
                                        (expenseData.manualSplits[member] /
                                            rateToUSD) *
                                        rateFromNewBase;
                                }
                            );
                        }

                        transaction.update(expenseDoc.ref, {
                            amount: convertedAmount,
                            manualSplits: convertedManualSplits,
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
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
        "MXN",
        "SGD",
        "HKD",
        "NOK",
        "KRW",
        "TRY",
        "RUB",
        "INR",
        "BRL",
        "ZAR",
    ];

    if (loading) return <CircularProgress />;

    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Base Currency</InputLabel>
            <Select
                value={groupCurrency}
                onChange={(e) => updateBaseCurrency(e.target.value)}
                label="Base Currency"
            >
                {currencyOptions.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                        {currency}
                    </MenuItem>
                ))}
            </Select>
            <Typography variant="caption">
                Select the base currency for the group.
            </Typography>
        </FormControl>
    );
};
