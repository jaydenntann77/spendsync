import { useState, useEffect } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export const useGetUserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        profilePhoto: "",
        userID: "",
        isAuth: false,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const authInfo = {
                    userID: user.uid,
                    name: user.displayName,
                    profilePhoto: user.photoURL,
                    isAuth: true,
                };
                localStorage.setItem("auth", JSON.stringify(authInfo));
                setUserInfo(authInfo);
            } else {
                localStorage.removeItem("auth");
                setUserInfo({
                    name: "",
                    profilePhoto: "",
                    userID: "",
                    isAuth: false,
                });
            }
        });

        return () => unsubscribe();
    }, []);

    return userInfo;
};
