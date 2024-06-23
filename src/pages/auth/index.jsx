import React from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import styles from "./Auth.module.css"; // Import the CSS module

export const Auth = () => {
    const navigate = useNavigate();
    const { isAuth } = useGetUserInfo();

    const signInWithGoogle = async () => {
        try {
            const results = await signInWithPopup(auth, provider);
            const authInfo = {
                userID: results.user.uid,
                name: results.user.displayName,
                profilePhoto: results.user.photoURL,
                isAuth: true,
            };
            console.log(results);
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
