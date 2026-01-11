"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import grocery from "@/asset/image/element/grocery.png";

type propType={
  nextstep:(s:number)=>void
}
const Welcome = ({nextstep}:propType) => {
  return (
    <>
      <div className="w-full min-h-screen bg-linear-to-t from-purple-800 to-purple-500 flex flex-col justify-center items-center">
        <motion.div
          initial={{
            y: -20,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 1,
          }}>
          <Image
            alt="Grcery Image"
            src={grocery}
            quality={100}
            className="h-20 sm:h-50 w-full"
            loading="eager"
          />
        </motion.div>
        <div className="text-center">
          <motion.h2
            className="text-2xl sm:text-5xl font-bold text-white"
            initial={{
              y: -20,
            }}
            animate={{
              y: 0,
            }}
            transition={{
              duration: 1,
            }}>
            Welcome To <span className="text-yellow-400">Bellyto</span>{" "}
          </motion.h2>
        </div>

        <motion.div
          initial={{
            y: 5,
            scale: 0.9,
          }}
          animate={{
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          className="text-center">
          <h2 className="text-xs sm:text-lg mt-2 text-white">
            Get groceries delivered to a doorstep in a minutes
          </h2>
          <button
            className="text-xs sm:text-lg mt-2 bg-yellow-500 hover:bg-yellow-600 cursor-pointer shadow-lg text-black p-3 font-bold rounded-lg transition active:scale-95"
            onClick={() => nextstep(2)}>
            Get Started
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default Welcome;
