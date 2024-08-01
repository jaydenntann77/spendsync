import GoogleMapReact from "google-map-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Typography, useMediaQuery, Paper, Box } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import Rating from "@mui/material/Rating";
import { IoLocation } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import _ from "lodash";

const Marker = ({ place, isDesktop }) => (
  <div>
    {!isDesktop ? (
      <LocationOnOutlined color="primary" fontSize="large" />
    ) : (
      <Paper elevation={3} style={{ padding: "10px" }}>
        <Typography variant="subtitle2" gutterBottom>
          {place.name}
        </Typography>
        <img
          src={
            place.photo
              ? place.photo.images.large.url
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHn3jT5zsWbNi1MEAlb0H4I8iOpylZ3GC9iQ&s"
          }
          alt={place.name}
          style={{ width: 100 }}
        />
        <Rating size="small" value={Number(place.rating)} readOnly />
      </Paper>
    )}
  </div>
);

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const mapRef = useRef();
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    if (mapRef.current && coordinates?.lat && coordinates?.lng) {
      console.log("Pan to coordinates:", coordinates);
      mapRef.current.panTo({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
      mapRef.current.setZoom(zoom); // Use the zoom state here
    }
  }, [coordinates, zoom]);

  const handleApiLoaded = (map, maps) => {
    mapRef.current = map;
    if (coordinates) {
      console.log("API Loaded - setting center and zoom", coordinates);
      map.setCenter(coordinates);
      map.setZoom(zoom);
    }
  };

  const handleMapChange = useCallback(
    _.debounce((e) => {
      console.log("Map changed:", e);
      setCoordinates({ lat: e.center.lat, lng: e.center.lng });
      setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
      setZoom(e.zoom);
    }, 500), // Adjust debounce time as needed
    []
  );

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyDoWbRMg1iJdZv90HRrUe1fhE6pSbbthZY",
        }}
        defaultCenter={{
          lat: coordinates?.lat ? coordinates.lat : 0,
          lng: coordinates?.lng ? coordinates.lng : 0,
        }}
        defaultZoom={16} // Initial zoom level
        center={coordinates}
        zoom={zoom}
        margin={[50, 50, 50, 50]}
        options={{}}
        onChange={handleMapChange}
        onChildClick={(child) => {
          console.log("Child clicked:", child);
          setChildClicked(child);
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) =>
          handleApiLoaded(map, maps)
        }
      >
        {places?.map((place, i) => {
          if (!place.latitude || !place.longitude) {
            console.warn(
              `Skipping place due to missing coordinates: ${place.name}`
            );
            return null;
          }

          console.log(
            "Rendering place:",
            place.name,
            place.latitude,
            place.longitude
          );

          return (
            <Box
              key={i}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              cursor="pointer"
              onClick={() => setChildClicked(i)}
            >
              <IoLocation color="red" fontSize={30} />
            </Box>
          );
        })}
        {coordinates.lat && coordinates.lng && (
          <Box
            lat={coordinates.lat}
            lng={coordinates.lng}
            cursor="pointer"
          >
            <IoLocation color="blue" fontSize={30} />
          </Box>
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
