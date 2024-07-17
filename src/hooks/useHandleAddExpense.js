import { useCallback } from "react";
import { doc, collection, addDoc, runTransaction } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useFetchGroupCurrency } from "./useFetchGroupCurrency";

export const useHandleAddExpense = (
    groupId,
    fetchExpenses,
    setRefreshKey,
    setAmount,
    setDescription, // Add setDescription
    setPaidBy,
    setInvolvedMembers,
    setSplitType,
    setManualSplits,
    currency,
    exchangeRates
) => {
    const { groupCurrency, loading } = useFetchGroupCurrency(groupId);

    const handleAddExpense = useCallback(
        async (
            e,
            amount,
            description,
            paidBy,
            involvedMembers,
            splitType,
            manualSplits
        ) => {
            e.preventDefault();

            if (loading) {
                console.log("Currency data is still loading.");
                return;
            }

            // Convert amount to base currency
            const rateToUSD = exchangeRates[currency];
            const rateFromBase = exchangeRates[groupCurrency];
            const convertedAmount = (amount / rateToUSD) * rateFromBase;

            const members = involvedMembers.map((member) => member.value);
            const splitAmount = parseFloat(convertedAmount) / members.length;

            try {
                await runTransaction(db, async (transaction) => {
                    const expensesRef = collection(
                        db,
                        "groups",
                        groupId,
                        "expenses"
                    );

                    // Read all balances before performing any writes
                    const balancesRef = collection(
                        db,
                        "groups",
                        groupId,
                        "balances"
                    );
                    const balanceDocs = {};
                    const reverseBalanceDocs = {};

                    for (const member of members) {
                        if (member !== paidBy) {
                            const balanceDocRef = doc(
                                balancesRef,
                                `${paidBy}_${member}`
                            );
                            const reverseBalanceDocRef = doc(
                                balancesRef,
                                `${member}_${paidBy}`
                            );
                            balanceDocs[member] = await transaction.get(
                                balanceDocRef
                            );
                            reverseBalanceDocs[member] = await transaction.get(
                                reverseBalanceDocRef
                            );
                        }
                    }

                    // Perform writes after all reads
                    await addDoc(expensesRef, {
                        amount: parseFloat(convertedAmount),
                        description, // Add description here
                        paidBy,
                        involvedMembers: members,
                        splitType,
                        manualSplits,
                        currency,
                        date: new Date(),
                    });

                    for (const member of members) {
                        if (member !== paidBy) {
                            const balanceDocRef = doc(
                                balancesRef,
                                `${paidBy}_${member}`
                            );
                            const reverseBalanceDocRef = doc(
                                balancesRef,
                                `${member}_${paidBy}`
                            );

                            let balanceAmount =
                                splitType === "manual"
                                    ? parseFloat(manualSplits[member])
                                    : splitAmount;
                            let reverseBalanceAmount = -balanceAmount;

                            if (balanceDocs[member].exists()) {
                                balanceAmount +=
                                    balanceDocs[member].data().amount;
                            }

                            if (reverseBalanceDocs[member].exists()) {
                                reverseBalanceAmount +=
                                    reverseBalanceDocs[member].data().amount;
                            }

                            transaction.set(balanceDocRef, {
                                from: member,
                                to: paidBy,
                                amount: balanceAmount,
                            });

                            transaction.set(reverseBalanceDocRef, {
                                from: paidBy,
                                to: member,
                                amount: reverseBalanceAmount,
                            });
                        }
                    }
                });

                // Reset form state
                setAmount("");
                setDescription(""); // Reset description
                setPaidBy("");
                setInvolvedMembers([]);
                setSplitType("equal");
                setManualSplits({});

                // Fetch updated expenses and balances
                fetchExpenses();
                setRefreshKey((prevKey) => prevKey + 1); // Update refreshKey to trigger balances update
            } catch (err) {
                console.error("Error adding expense:", err);
            }
        },
        [
            groupId,
            fetchExpenses,
            setRefreshKey,
            setAmount,
            setDescription, // Add setDescription to dependency array
            setPaidBy,
            setInvolvedMembers,
            setSplitType,
            setManualSplits,
            currency,
            exchangeRates,
            groupCurrency,
            loading,
        ]
    );

    return handleAddExpense;
};
