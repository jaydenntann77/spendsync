import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import styles from "./GroupBalances.module.css";
import { useFetchGroupCurrency } from "../../hooks/useFetchGroupCurrency";

export const GroupBalances = ({ groupId, refreshBalances }) => {
    const [balances, setBalances] = useState([]);
    const { groupCurrency } = useFetchGroupCurrency(groupId);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const balancesRef = collection(
                    db,
                    "groups",
                    groupId,
                    "balances"
                );
                const balancesSnapshot = await getDocs(balancesRef);
                const balancesList = balancesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBalances(balancesList);
            } catch (err) {
                console.error("Error fetching balances:", err);
            }
        };

        fetchBalances();
    }, [groupId, refreshBalances]);

    const filteredBalances = balances.filter((balance) => balance.amount > 0);

    return (
        <div className={styles.balances}>
            <h2>Group Balances</h2>
            <ul>
                {filteredBalances.map((balance) => (
                    <li key={balance.id}>
                        {balance.from} owes {balance.to} $
                        {balance.amount.toFixed(2)} {groupCurrency}
                    </li>
                ))}
            </ul>
        </div>
    );
};
