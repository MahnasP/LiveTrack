import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import MapContainerComponent from "../components/MapContainerComponent";


function Home() {
  const [socket, setSocket] = useState(null);
  const [myposition, setMyposition] = useState([0,0]);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);


  useEffect(() => {  
    const sock = io(import.meta.env.VITE_BACKEND_SERVER);
  setSocket(sock);
    return () => {
      if (sock) sock.disconnect();
    };
  }, []);


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    function successCB(pos) {
      const newposition = [pos.coords.latitude, pos.coords.longitude];
      setMyposition(newposition);
      socket.emit("send-location", newposition);
      setError(null);
    }

    function errorCB(err) {
      setError(err.message);
    }

    const watchId = navigator.geolocation.watchPosition(successCB, errorCB, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0});

    return (() => { navigator.geolocation.clearWatch(watchId); })
  },[])
   

  return (<>
    {error ? (<h1> Error: {error} </h1>) : (
      <MapContainerComponent myposition={myposition} />
    )}
    </>
    );
   
}

export default Home;
