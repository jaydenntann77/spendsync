import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchExchangeRates = () => {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const docRef = doc(db, "exchangeRates", "latest");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExchangeRates(docSnap.data());
                } else {
                    setError("No exchange rates found");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRates();
    }, []);

    return { exchangeRates, error };
};
