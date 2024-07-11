// src/hooks/useFetchExchangeRates.js

import { useState, useEffect } from "react";
import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchExchangeRates = () => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const exchangeRatesDoc = await getDoc(
                    doc(db, "exchangeRates", "latest")
                );
                if (exchangeRatesDoc.exists()) {
                    setExchangeRates(exchangeRatesDoc.data().conversion_rates);
                } else {
                    console.error("No exchange rates found");
                }
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    return { exchangeRates, loading };
};
