"use client"

import Navbar from "../../components/Navbar"
import Problem from "../../components/Problem"

import Link from 'next/link'
import { AiOutlinePlus } from 'react-icons/ai'

export default function problems () {
return (
    <div className="overflow-x-hidden">
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-5 p-5">
        <Problem />
        <Problem />
        <Problem />
        <Problem />
      </section>

      <Link className="fixed sm:bottom-5 sm:right-5 bottom-2 right-2" href="/problems/new">
        
          <button className="transition-colors duration-150 bg-[#3AB3D7] hover:bg-blue-500  text-white rounded-full p-2">
            <AiOutlinePlus className="w-8 h-8" /> 
          </button>
        
      </Link>

    </div>
)
}