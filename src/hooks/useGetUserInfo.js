export const useGetUserInfo = () => {
    // Get the item from localStorage
    const auth = localStorage.getItem("auth");

    // If the item exists, parse it; otherwise, use an empty object
    const { name, profilePhoto, userID, isAuth } = auth ? JSON.parse(auth) : {};

    return { name, profilePhoto, userID, isAuth };
};
