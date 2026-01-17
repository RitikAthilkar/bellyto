'use client'
import { getSocket } from '@/config/websocket'
import React, { useEffect } from 'react'

const LocationUpdater = ({userId}:{userId:string}) => {
    let socket = getSocket()
    useEffect(()=>{
        if (!userId) return;
        if (!navigator.geolocation) return;
        socket.emit("identity", userId);
        const watcher = navigator.geolocation.watchPosition((pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;

        console.log("location ", lat)
         
        socket.emit("update-location", {
            userId,
            latitude: lat,
            longitude: long,
        });
        },(error)=>{console.log(error)},{enableHighAccuracy:true});

        
        return ()=>navigator.geolocation.clearWatch(watcher)
    },[userId])

  return null
}

export default LocationUpdater
 

