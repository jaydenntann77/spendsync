import axios from "axios"; //library to help make calls

const URl = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'

export const getPlacesData = async(sw, ne) => {
    try {
        const {data: {data}} = await axios.get(URl, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
            },
            headers: {
                'x-rapidapi-key': 'f989ac54ecmsh568f25c9d4bb287p190175jsn1c9e77a1a215',
                'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
            }
        });
        return data 

    } catch (error) {
        console.log(error)
    }
}