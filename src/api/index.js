import axios from "axios";


export const getPlacesData = async (type, sw, ne) => {
    try {
        const response = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
            },
            headers: {
                "x-rapidapi-key": '477449a74emsh87711c126dbeee4p1cfd7ejsn51b49519bb93',
                "x-rapidapi-host": 'travel-advisor.p.rapidapi.com',
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
