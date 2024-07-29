import GoogleMapReact from "google-map-react";
import React, { useEffect, useRef, useState } from "react";
import { Typography, useMediaQuery, Paper } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import Rating from '@mui/material/Rating';

const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const mapRef = useRef();
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    if (mapRef.current && coordinates.lat && coordinates.lng) {
      mapRef.current.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      mapRef.current.setZoom(zoom); // Use the zoom state here
    }
  }, [coordinates, zoom]);

  const handleApiLoaded = (map, maps) => {
    mapRef.current = map;
    if (coordinates) {
      map.setCenter(coordinates);
      map.setZoom(zoom);
    }
  };

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDoWbRMg1iJdZv90HRrUe1fhE6pSbbthZY' }} // Replace with your actual API key
        defaultCenter={coordinates}
        defaultZoom={16} // Initial zoom level
        margin={[50, 50, 50, 50]}
        options={{}}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          setZoom(e.zoom); // Update the zoom state
        }}
        onChildClick={(child) => setChildClicked(child)}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {places?.map((place, i) => (
          <div
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlined color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} style={{ padding: '10px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  {place.name}
                </Typography>
                <img
                  src={place.photo ? place.photo.images.large.url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHn3jT5zsWbNi1MEAlb0H4I8iOpylZ3GC9iQ&s'}
                  alt={place.name}
                  style={{ width: 100 }}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
}

export default Map;
