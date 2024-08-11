import React, { useState, useEffect } from "react";
import { CssBaseline, Grid, Box } from "@mui/material"; // Added Box for potential styling
import { getPlacesData } from "../../api";
import { List } from "../../components/List/List";
import Map from "../../components/Map/Map";

const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const lat1 = coords1.lat;
    const lon1 = coords1.lng;
    const lat2 = coords2.lat;
    const lon2 = coords2.lng;

    const R = 6371; // Earth radius in km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const Nearby = () => {
    const [places, setPlaces] = useState([]);
    const [rating, setRating] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [bounds, setBounds] = useState(null);
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [filteredPlaces, setFilteredPlaces] = useState([])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
            }
        );
    }, []);

    useEffect(() => {
      const filtered = places.filter((place) => place.rating > rating && place.num_reviews > 0);
      setFilteredPlaces(filtered);
    }, [rating, places]);

    useEffect(() => {
        if (bounds) {
            setIsLoading(true);
            getPlacesData(type, bounds.ne, bounds.sw)
                .then((data) => {
                    const placesWithDistance = data.map((place) => ({
                        ...place,
                        distance: haversineDistance(coordinates, {
                            lat: place.latitude,
                            lng: place.longitude,
                        }),
                    }));
                    setPlaces(
                        placesWithDistance.sort(
                            (a, b) => a.distance - b.distance
                        )
                    );
                    setFilteredPlaces([]); // Reset filtered places when new data is fetched
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching places data: ", error);
                });
        }
    }, [type, bounds, coordinates]);

    return (
        <>
            <CssBaseline />
            {/* Wrap content in a responsive Box to handle padding and margin */}
            <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <List
                            places={filteredPlaces.length ? filteredPlaces : places}
                            childClicked={childClicked}
                            isLoading={isLoading}
                            type={type}
                            setType={setType}
                            rating={rating}
                            setRating={setRating}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Map
                            setCoordinates={setCoordinates}
                            setBounds={setBounds}
                            coordinates={coordinates}
                            places={filteredPlaces.length ? filteredPlaces : places}
                            setChildClicked={setChildClicked}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
