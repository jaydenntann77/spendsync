import axios from "axios";

const URL =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary";

export const getPlacesData = async (sw, ne) => {
    try {
        const response = await axios.get(URL, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
            },
            headers: {
                "x-rapidapi-key":
                    "feb060c542mshe056b9c7ee1ca4ep15ec2fjsnc3e3322c162f",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
            },
        });

        const {
            data: { data },
        } = response;

        if (!data) {
            throw new Error("No data available");
        }

        return data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 429) {
                console.error("Too many requests. Please try again later.");
            } else if (error.response.status === 403) {
                console.error("Access forbidden. Please check your API key.");
            } else {
                console.error("Error fetching places data:", error.message);
            }
        } else {
            console.error("Network error:", error.message);
        }
        return [];
    }
};
