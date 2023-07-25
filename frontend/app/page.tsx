"use client"

import { Web3Button } from "@web3modal/react";
import {useEffect, useState} from "react"

// components
import GetProblemCounter from "../components/GetProblemCounter";
import RegisterMember from "../components/RegisterMember"
import Navbar from "../components/Navbar"


import Image from "next/image";

import { useAccount} from 'wagmi'


export default function home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  //Address:
  const { address, isConnecting, isDisconnected } = useAccount()
  

  if(!mounted) return <></>
 

  return (
    <div className="h-screen overflow-x-hidden bg-gradient-to-br bg-gradient-135 from-white via-transparent to-[#3AB3D7]">
      <Navbar />
      {/* <div>{address}</div> */}
      <div className="flex justify-center items-center p-5 md:flex-row flex-col">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl text-sky-400 font-bold mw">Welcome to SpiralDAO</h1>
          <p className="max-w-md ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus veniam, sequi eius id voluptates incidunt facilis quidem reiciendis, iste tenetur iusto! Animi quia facilis deleniti. Sit in error impedit fugiat.</p>
          {/* <button className="bg-sky-400 rounded-3xl text-white p-2 text-bold w-40">Join the DAO</button> */}
          <Web3Button/> 

        </div>

        <div>
        <Image
          src="/assets/spiral_hero_image.png"
          className="max-w-md z-30"
          width={450}
          height={450}
          alt="Spiral hero image"
        />
        </div>
      </div>

          {/* <RegisterMember /> */}
      {/* <GetProblemCounter /> */}
    </div>
  )
  
}
