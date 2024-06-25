import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import "./GroupBalances.css";

export const GroupBalances = ({ groupId }) => {
    const [balances, setBalances] = useState([]);

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
    }, [groupId]);

    return (
        <div className="group-balances">
            <h2>Group Balances</h2>
            <ul>
                {balances.map((balance) => (
                    <li key={balance.id}>
                        <p>
                            {balance.from} owes {balance.to} $
                            {balance.amount.toFixed(2)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
