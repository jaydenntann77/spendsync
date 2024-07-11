import React from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import styles from "./Auth.module.css"; // Import the CSS module

export const Auth = () => {
    const navigate = useNavigate();
    const { isAuth } = useGetUserInfo();

    const signInWithGoogle = async () => {
        try {
            const results = await signInWithPopup(auth, provider);
            const userID = results.user.uid;
            const authInfo = {
                userID: userID,
                name: results.user.displayName,
                profilePhoto: results.user.photoURL,
                isAuth: true,
            };
            console.log("User signed in:", results);

            // Check if the user document exists
            const userDocRef = doc(db, "users", userID);
            const userDocSnapshot = await getDoc(userDocRef);
            console.log("User document exists:", userDocSnapshot.exists());

            if (!userDocSnapshot.exists()) {
                // Save user info to Firestore
                await setDoc(userDocRef, {
                    userID: userID,
                    name: results.user.displayName,
                    profilePhoto: results.user.photoURL,
                    defaultCategoriesAdded: false, // Add a flag to indicate if default categories have been added
                });
                console.log("User document created");
            }

            const userDocData = userDocSnapshot.exists()
                ? userDocSnapshot.data()
                : null;
            console.log("User document data:", userDocData);

            if (
                !userDocSnapshot.exists() ||
                !userDocData.defaultCategoriesAdded
            ) {
                // Add default categories to the user's categories subcollection
                const defaultCategories = [
                    { name: "Food", type: "expense" },
                    { name: "Transport", type: "expense" },
                    { name: "Entertainment", type: "expense" },
                    { name: "Salary", type: "income" },
                    { name: "Gift", type: "income" },
                ];

                const categoriesCollectionRef = collection(
                    db,
                    "users",
                    userID,
                    "categories"
                );

                for (const category of defaultCategories) {
                    await addDoc(categoriesCollectionRef, category);
                    console.log("Category added:", category);
                }

                // Update the flag in the user document
                await setDoc(
                    userDocRef,
                    { defaultCategoriesAdded: true },
                    { merge: true }
                );
                console.log(
                    "User document updated with defaultCategoriesAdded flag"
                );
            }

            localStorage.setItem("auth", JSON.stringify(authInfo));
            navigate("/expense-tracker");
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    if (isAuth) {
        return <Navigate to="/expense-tracker" />;
    }

    return (
        <div className={styles.loginPageBody}>
            <div className={styles.loginPage}>
                <div className={styles.loginContainer}>
                    <h1>Welcome to SpendSync</h1>
                    <p>Sign in with Google to continue</p>
                    <button
                        className={styles.loginWithGoogleButton}
                        onClick={signInWithGoogle}
                    >
                        <img
                            src="https://img.icons8.com/color/16/000000/google-logo.png"
                            alt="Google logo"
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};
