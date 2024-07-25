import GoogleMapReact from "google-map-react";
import React from "react";
import { useMediaQuery } from "@mui/material";

const Map = ({ setCoordinates, setBounds, coordinates }) => {
  const isMobile = useMediaQuery('(min-width:600px)');

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDoWbRMg1iJdZv90HRrUe1fhE6pSbbthZY' }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{}}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={() => {}}
      />
    </div>
  );
}

export default Map;
