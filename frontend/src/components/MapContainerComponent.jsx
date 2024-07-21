import { Icon } from 'leaflet';
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"


function MapContainerComponent({ myposition, allPositions, myId }) {
    
    const myicon = new Icon({
        iconUrl: "/user.png",
        iconSize: [35,35],
    })
  
  const markers = [];

  Object.entries(allPositions).forEach(([key, value]) => {
    console.log(key, " : ", value);
            if (key != myId)
                markers.push(<Marker key={key} position={value} />); 
        })


  return (
    <MapContainer
      center={myposition}
      zoom={13}
      scrollWheelZoom={false}
      className="h-5/6 w-4/5 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-shadow duration-300"
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={myposition} icon={myicon}/>
      <MarkerClusterGroup chunkedLoading >
        {markers}
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