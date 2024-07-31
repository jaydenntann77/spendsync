import GoogleMapReact from "google-map-react";
import React, { useEffect, useRef, useState } from "react";
import { Typography, useMediaQuery, Paper } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import Rating from '@mui/material/Rating';

const Marker = ({ place, isDesktop }) => (
  <div>
    <IoLocation color="red" fontSize={30} />
  </div>
);

const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const mapRef = useRef();
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    if (mapRef.current && coordinates?.lat && coordinates?.lng) {
      console.log('Pan to coordinates:', coordinates);
      mapRef.current.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      mapRef.current.setZoom(zoom); // Use the zoom state here
    }
  }, [coordinates, zoom]);

  const handleApiLoaded = (map, maps) => {
    mapRef.current = map;
    if (coordinates) {
      console.log('API Loaded - setting center and zoom', coordinates);
      map.setCenter(coordinates);
      map.setZoom(zoom);
    }
  };

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDoWbRMg1iJdZv90HRrUe1fhE6pSbbthZY' }} // Replace with your actual API key
        defaultCenter={{ lat: coordinates?.lat || 0, lng: coordinates?.lng || 0 }}
        defaultZoom={16} // Initial zoom level
        center={coordinates}
        zoom={zoom}
        margin={[50, 50, 50, 50]}
        options={{}}
        onChange={(e) => {
          console.log('Map changed:', e);
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          setZoom(e.zoom); // Update the zoom state
        }}
        onChildClick={(child) => {
          console.log('Child clicked:', child);
          setChildClicked(child);
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {places?.map((place, i) => {
          if (!place.latitude || !place.longitude) {
            console.warn(`Skipping place due to missing coordinates: ${place.name}`);
            return null;
          }

          console.log('Rendering place:', place.name, place.latitude, place.longitude);

          return (
            <Marker
              key={i}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              place={place}
              isDesktop={isDesktop}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default Map;
