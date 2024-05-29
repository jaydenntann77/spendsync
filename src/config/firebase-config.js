// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBq1L-tfagJzne7beE2qZ2xmZAsczDKU5s",
    authDomain: "expense-tracker-82183.firebaseapp.com",
    projectId: "expense-tracker-82183",
    storageBucket: "expense-tracker-82183.appspot.com",
    messagingSenderId: "552164931339",
    appId: "1:552164931339:web:25a2e08a1cc5a94a0d540e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// firebase login
// firebase init
// firebase deploy
