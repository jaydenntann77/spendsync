import { useEffect, useState } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionTotal, setTransactionTotal] = useState({
        balance: 0.0,
        income: 0.0,
        expenses: 0.0,
    });

    const { userID } = useGetUserInfo();

    useEffect(() => {
        if (!userID) return; // Wait until userID is available

        const transactionCollectionRef = collection(
            db,
            "users",
            userID,
            "transactions"
        );

        const getTransactions = async () => {
            const queryTransactions = query(
                transactionCollectionRef,
                orderBy("createdAt")
            );

            const unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
                let docs = [];
                let totalIncome = 0;
                let totalExpenses = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({ ...data, id });

                    if (data.transactionType === "expense") {
                        totalExpenses += Number(data.transactionAmount);
                    } else {
                        totalIncome += Number(data.transactionAmount);
                    }
                });

                setTransactions(docs);
                setTransactionTotal({
                    balance: totalIncome - totalExpenses,
                    expenses: totalExpenses,
                    income: totalIncome,
                });
            });

            return () => unsubscribe();
        };

        getTransactions();
    }, [userID]); // Depend on userID

    return { transactions, transactionTotal };
};
