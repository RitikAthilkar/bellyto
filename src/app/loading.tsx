"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import grocery from "@/asset/image/element/grocery.png";

type propType = {
  nextstep: (s: number) => void;
};

const Loading = ({ nextstep }: propType) => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Offline Screen
  if (!online) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-t from-purple-900 to-purple-600 flex flex-col items-center justify-center text-center px-6">
        <Image src={grocery} alt="Bellyto" width={80} height={80} priority />

        <h1 className="mt-4 text-xl font-semibold text-white">
          No Internet Connection
        </h1>

        <p className="text-white/80 text-sm mt-1">
          Check your network and try again
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2 rounded-full bg-yellow-400 text-black text-sm font-medium">
          Retry
        </button>
      </div>
    );
  }

  // Loading Screen
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-purple-900 to-purple-600 flex flex-col items-center justify-center">
 
      <div className="relative flex items-center justify-center mt-5">
        <div className="h-10 w-10 rounded-full border-2 border-white/30"></div>
        <div className="absolute h-10 w-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
      </div>

      <p className="mt-4 text-white/90 text-lg">Loading...</p>
    </div>
  );
};

export default Loading;
