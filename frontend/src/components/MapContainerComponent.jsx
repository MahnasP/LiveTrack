import { Icon } from 'leaflet';
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"


function MapContainerComponent({ myposition }) {
    
    const myicon = new Icon({
        iconUrl: "/user.png",
        iconSize: [35,35],
    })

  return (
    <MapContainer
      center={myposition}
      zoom={13}
      scrollWheelZoom={false}
      className="h-4/6 w-4/5"
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={myposition} icon={myicon}/>
      <MarkerClusterGroup chunkedLoading >
          {/* {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coord}/>
      ))} */}
      </MarkerClusterGroup>
          <RecenterMap myposition={myposition} />
    </MapContainer>
  )
}

function RecenterMap({ myposition }) {
    const map = useMap();

  useEffect(() => {
    map.setView(myposition);
  }, [myposition, map]);
    
    return null;
}

export default MapContainerComponent