import GoogleMapReact from "google-map-react";
import React, { useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { Google, LocationOnOutlined } from "@mui/icons-material";

const Map = ({ setCoordinates, setBounds, coordinates, places }) => {
  const isMobile = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    // Adjust the map center and zoom level when coordinates change
    if (mapRef.current) {
      mapRef.current.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      mapRef.current.setZoom(16); // Set zoom level to 16 for a closer view
    }
  }, [coordinates]);

  const mapRef = React.useRef();

  const handleApiLoaded = (map, maps) => {
    mapRef.current = map;
    // Center the map to the current coordinates and set the initial zoom level
    map.setCenter(coordinates);
    map.setZoom(16);
  };

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDoWbRMg1iJdZv90HRrUe1fhE6pSbbthZY' }} // Replace with your actual API key
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={16} // Set default zoom level to 16 for a closer view
        margin={[50, 50, 50, 50]}
        options={{}}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={() => {}}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      />
    
      <GoogleMapReact/>
    </div>
  );
}

export default Map;
