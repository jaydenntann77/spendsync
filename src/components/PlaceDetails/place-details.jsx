import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, Chip, CardActions } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Phone } from "@mui/icons-material";
import Rating from '@mui/lab/Rating';


const PlaceDetails = ({ place }) => {
    return (
        <Card elevation={6}>
            <CardMedia 
            style={{height:150 }}
            image={place.photo ? place.photo.images.large.url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHn3jT5zsWbNi1MEAlb0H4I8iOpylZ3GC9iQ&s'}
            title={place.name} />
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {place.name}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Price</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.price_level}</Typography>
                </Box>
                {place?.cuisine?.map(({ name }) => (
                <Chip key={name} size="small" label={name} />))}
                {place.address && (
                <Typography gutterBottom variant="body2" color="textSecondary">
                    <LocationOn />{place.address}
                </Typography>
                )}
            </CardContent>

        </Card>
    );

}

export default PlaceDetails;