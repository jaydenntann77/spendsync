import axios from "axios"; //library to help make calls

const URl = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'

export const getPlacesData = async(sw, ne) => {
    try {
        const {data : {data}} = await axios.get(URl, {
                params: {
                  bl_latitude: sw.lat,
                  tr_latitude: ne.lat,
                  bl_longitude: sw.lng,
                  tr_longitude: ne.lng,
                },
                headers: {
                  'x-rapidapi-key': '270c57e17emsh1590d83e1fd7a63p1ce04bjsn6e747f4b9011',
                  'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
                }
              });
        return data;

    } catch (error) {
        console.log(error)
    }
}