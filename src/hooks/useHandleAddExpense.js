import { useCallback } from "react";
import { doc, collection, addDoc, runTransaction } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useHandleAddExpense = (
    groupId,
    fetchExpenses,
    setRefreshKey,
    setAmount,
    setPaidBy,
    setInvolvedMembers,
    setSplitType
) => {
    const handleAddExpense = useCallback(
        async (e, amount, paidBy, involvedMembers, splitType) => {
            e.preventDefault();
            const members = involvedMembers.map((member) => member.value);
            const splitAmount = parseFloat(amount) / members.length;

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
                        amount: parseFloat(amount),
                        paidBy,
                        involvedMembers: members,
                        splitType,
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

                            let balanceAmount = splitAmount;
                            let reverseBalanceAmount = -splitAmount;

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
                setPaidBy("");
                setInvolvedMembers([]);
                setSplitType("equal");

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
            setPaidBy,
            setInvolvedMembers,
            setSplitType,
        ]
    );

    return handleAddExpense;
};
