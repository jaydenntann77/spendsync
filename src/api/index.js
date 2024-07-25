import axios from "axios"; //library to help make calls

const URl = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'

const options = {
  params: {
    bl_latitude: '11.847676',
    tr_latitude: '12.838442',
    bl_longitude: '109.095887',
    tr_longitude: '109.149359',
  },
  headers: {
    'x-rapidapi-key': '270c57e17emsh1590d83e1fd7a63p1ce04bjsn6e747f4b9011',
    'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
  }
};

export const getPlacesData = async() => {
    try {
        const {data : {data}} = await axios.get(URl, options);
        return data;

    } catch (error) {
        console.log(error)
    }
}