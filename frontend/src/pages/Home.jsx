import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import MapContainerComponent from "../components/MapContainerComponent";


function Home() {
  const [socket, setSocket] = useState(null);
  const [myposition, setMyposition] = useState([0,0]);
  const [error, setError] = useState(null);
  const [allPositions, setAllPositions] = useState({});


  useEffect(() => {  
    const sock = io(import.meta.env.VITE_BACKEND_SERVER);
    setSocket(sock);
    sock.on("get-locations", (updatedMapofLocations) => {
      setAllPositions(updatedMapofLocations);
    })
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
      console.log(socket);
      socket.emit("send-location", newposition);
      setError(null);
    }

    function errorCB(err) {
      setError(err.message);
    }

    const watchId = navigator.geolocation.watchPosition(successCB, errorCB, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0});

    return (() => { navigator.geolocation.clearWatch(watchId); })
  },[socket])
   

  return (<>
    {error ? (<h1> Error: {error} </h1>) : (
      <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10
        p-4 flex flex-col items-center justify-center text-left">
        <h1 className=" text-left mb-4 text-3xl font-extrabold md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">LiveTrack</h1>
        <MapContainerComponent myposition={myposition} allPositions={allPositions} myId={socket?.id} />
        </div>
    )}
        
    </>
    );
   
}

export default Home;
