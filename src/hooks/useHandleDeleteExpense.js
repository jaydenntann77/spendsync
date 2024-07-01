import { useCallback } from "react";
import { doc, collection, runTransaction } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useHandleDeleteExpense = (
    groupId,
    fetchExpenses,
    setRefreshKey
) => {
    const handleDeleteExpense = useCallback(
        async (
            expenseId,
            involvedMembers,
            paidBy,
            amount,
            splitType,
            manualSplits
        ) => {
            const splitAmount = amount / involvedMembers.length;

            try {
                await runTransaction(db, async (transaction) => {
                    const expenseDocRef = doc(
                        db,
                        "groups",
                        groupId,
                        "expenses",
                        expenseId
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

                    for (const member of involvedMembers) {
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
                    transaction.delete(expenseDocRef);

                    for (const member of involvedMembers) {
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
                                    ? -parseFloat(manualSplits[member])
                                    : -splitAmount;
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

                // Fetch updated expenses and balances
                fetchExpenses();
                setRefreshKey((prevKey) => prevKey + 1); // Update refreshKey to trigger balances update
            } catch (err) {
                console.error("Error deleting expense:", err);
            }
        },
        [groupId, fetchExpenses, setRefreshKey]
    );

    return handleDeleteExpense;
};
