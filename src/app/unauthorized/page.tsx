"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import grocery from "@/asset/image/element/grocery.png";
import { Ban } from "lucide-react";

type propType = {
  nextstep: (s: number) => void;
};

const Loading = ({ nextstep }: propType) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-purple-900 to-purple-600 flex flex-col items-center justify-center text-center px-6">
      {/* <Ban className="text-white "/> */}
      <h1 className="mt-4 text-3xl font-semibold text-white">Access Denied</h1>

      <p className="text-white/80 text-sm mt-1">
        you are not authorized to access these resources
      </p>

      <button
        onClick={() => window.open("/")}
        className="mt-5 px-5 py-2 rounded-full bg-yellow-400 text-black text-sm font-medium">
        go to home
      </button>
    </div>
  );

  // Loading Screen
};

export default Loading;
