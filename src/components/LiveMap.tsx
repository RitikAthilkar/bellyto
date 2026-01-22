"use client";
// import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// import L,{ LatLngExpression } from "leaflet";
import { SearchBox } from "@mapbox/search-js-react";
import { RootState } from "@/redux/store";
import {
  BuildingIcon,
  EarthIcon,
  HomeIcon,
  Loader2,
  LocateFixed,
  LocationEditIcon,
  Phone,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MdDeliveryDining } from "react-icons/md";

import axios from "axios";
import { motion, spring } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface IDelivery {
  _id?: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
  interface ILocation{
    latitude:number,
    longitude:number
  }
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const LiveMap = ({
  userLocation,
  deliveryboylocation,
}: {
  userLocation: ILocation;
  deliveryboylocation: ILocation;
}) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subtotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchloader, setSearchLoader] = useState(false);

  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);


  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const routeSourceAddedRef = useRef(false);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const deliveryMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const routeFittedRef = useRef(false);

  // --- Initialize Map ---
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 15,
    });

    map.on("load", () => {
      setMapLoaded(true);

      if (!map.getSource("route-line")) {
        map.addSource("route-line", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: [] },
          },
        });

        map.addLayer({
          id: "route-layer",
          type: "line",
          source: "route-line",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#00aaff", "line-width": 4 },
        });

        routeSourceAddedRef.current = true;
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);


  // --- Fetch route from Mapbox Directions API ---
  const getRoadRoute = async (userLoc: ILocation, deliveryLoc: ILocation) => {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${deliveryLoc.longitude},${deliveryLoc.latitude};` +
      `${userLoc.longitude},${userLoc.latitude}` +
      `?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();
    // return data.routes[0].geometry.coordinates;
     return {
       coords: data.routes[0].geometry.coordinates,
       duration: data.routes[0].duration, // seconds
       distance: data.routes[0].distance, // meters
     };
  };

  // --- Update markers & route ---
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    if (!userLocation || !deliveryboylocation) return;

    const map = mapInstanceRef.current;

    // --- User Marker ---
    if (!userMarkerRef.current) {
      const el = document.createElement("img");
      el.src = "https://cdn-icons-png.flaticon.com/128/4821/4821951.png";
      el.style.width = "40px";
      el.style.height = "40px";

      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat([
        userLocation.longitude,
        userLocation.latitude,
      ]);
    }

    // --- Delivery Boy Marker ---
    if (!deliveryMarkerRef.current) {
      const el = document.createElement("img");
      el.src = "https://cdn-icons-png.flaticon.com/128/16399/16399661.png";
      el.style.width = "40px";
      el.style.height = "40px";

      deliveryMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([
          deliveryboylocation.longitude,
          deliveryboylocation.latitude,
        ])
        .addTo(map);
    } else {
      deliveryMarkerRef.current.setLngLat([
        deliveryboylocation.longitude,
        deliveryboylocation.latitude,
      ]);
    }

    // --- Draw Route ---
(async () => {
  const routeSource = map.getSource("route-line") as mapboxgl.GeoJSONSource;
  if (!routeSource) return;

  const { coords, duration } = await getRoadRoute(
    userLocation,
    deliveryboylocation,
  );

  routeSource.setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coords,
    },
  });

  setEtaMinutes(Math.ceil(duration / 60)); // convert seconds → minutes

  if (!routeFittedRef.current) {
    const bounds = coords.reduce(
      (b: mapboxgl.LngLatBounds, coord: [number, number]) => b.extend(coord),
      new mapboxgl.LngLatBounds(coords[0], coords[0]),
    );

    map.fitBounds(bounds, { padding: 80,zoom:15, duration: 1000 });
    routeFittedRef.current = true;
  }
})();

  }, [mapLoaded, userLocation, deliveryboylocation]);

  const handlecurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);

          if (mapInstanceRef.current) {
            // Center map
            mapInstanceRef.current.setCenter([longitude, latitude]);

            // Move existing marker or create if not exists
            if (markerRef.current) {
              markerRef.current.setLngLat([longitude, latitude]);
            } else {
              markerRef.current = new mapboxgl.Marker({ draggable: true })
                .setLngLat([longitude, latitude])
                .addTo(mapInstanceRef.current)
                .on("dragend", (e) => {
                  const lngLat = e.target.getLngLat();
                  setPosition([lngLat.lat, lngLat.lng]);
                });
            }
          }
        },
        (err) => {
          console.log(`location error ${err}`);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 100000 },
      );
    }
  };

  return (
    <>
      <div className="relative h-[50vh] w-full p-2 ">
        {/* {JSON.stringify(userLocation)}
        {JSON.stringify(deliveryboylocation)} */}
        Delivery in {etaMinutes} min
        <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
        <motion.button
          onClick={handlecurrentLocation}
          type="button"
          whileTap={{ scale: 0.97 }}
          className="absolute right-2 bottom-2 bg-green-600 text-xl z-50 p-2 text-white rounded-full">
          <LocateFixed />
        </motion.button>
      </div>
    </>
  );
};;

export default LiveMap;
