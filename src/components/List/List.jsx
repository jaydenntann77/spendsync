import React, { useState } from "react";
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { Form } from "react-router-dom";
import PlaceDetails from "../PlaceDetails /PlaceDetails";



const List = () => {
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    const places =[
        {name: "Cool Place"},
        {name: "Best Beer"},
        {name: "Best Burgers"},
        {name: "Cool Place"},
        {name: "Best Beer"},
        {name: "Best Burgers"},
        {name: "Cool Place"},
        {name: "Best Beer"},
        {name: "Best Burgers"}
    ];

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" style={{ marginBottom: "20px", textAlign: "left", fontSize: "24px" }}>
                Restaurants, Hotels & Attractions around you
            </Typography>
            <FormControl style={{ margin: "16px 8px", minWidth: "150px" }}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="restaurants">Restaurants</MenuItem>
                    <MenuItem value="hotels">Hotels</MenuItem>
                    <MenuItem value="attractions">Attractions</MenuItem>
                </Select>
            </FormControl>
            <FormControl style={{ margin: "16px 8px", minWidth: "150px" }}>
                <InputLabel>Rating</InputLabel>
                <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={3}>Above 3.0</MenuItem>
                    <MenuItem value={4}>Above 4.0</MenuItem>
                    <MenuItem value={4.5}>Above 4.5</MenuItem>
                </Select>
            </FormControl>
            <div style={{ maxHeight: '600px', overflowY: 'scroll', marginTop: '20px',paddingRight: '10px'}}>
                <Grid container spacing={3} style={{ paddingTop: "20px" }}>
                    {places?.map((place, i)=> (
                    <Grid item key={i} xs={12}>
                        <PlaceDetails place={place} />
                    </Grid>
                ))}
                </Grid>
            </div>
        </div>
    );
};

export default List;
