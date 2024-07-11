// Ensure the file is either .js or .mjs based on your setup
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const API_KEY = "1acb84ccd6650bfca0d15b2b";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Scheduled function to update exchange rates every 12 hours
exports.updateExchangeRates = functions.pubsub
    .schedule("every 12 hours")
    .onRun(async (context) => {
        try {
            const response = await axios.get(BASE_URL);
            const data = response.data;

            if (data.result === "success") {
                await admin
                    .firestore()
                    .collection("exchangeRates")
                    .doc("latest")
                    .set(data);
                console.log("Exchange rates updated successfully");
            } else {
                console.error("Failed to fetch exchange rates:", data);
            }
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    });

// HTTPS function to manually update exchange rates
exports.updateExchangeRatesNow = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(BASE_URL);
        const data = response.data;

        if (data.result === "success") {
            await admin
                .firestore()
                .collection("exchangeRates")
                .doc("latest")
                .set(data);
            console.log("Exchange rates updated successfully");
            res.send("Exchange rates updated successfully");
        } else {
            console.error("Failed to fetch exchange rates:", data);
            res.status(500).send("Failed to fetch exchange rates");
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        res.status(500).send("Error fetching exchange rates");
    }
});
