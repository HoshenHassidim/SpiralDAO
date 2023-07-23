import React, { useState } from "react";
import { Turn as Hamburger } from "hamburger-react";
import { Web3Button } from "@web3modal/react";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center p-2 px-5 sticky top-0 drop-shadow-lg bg-blue-500 z-20 backdrop-filter backdrop-blur-lg bg-opacity-30">
      <a className="logo-a" href="/">
        {/* <h1 className="text-2xl font-bold">SpiralDAO</h1> */}
        <Image
          src="/assets/spiral_logo.png"
          className="cursor-pointer max-w-md z-30"
          href="/"
          width={50}
          height={50}
          alt="SpiralDAO Logo"
        />
      </a>

      <button
        onClick={() => {
          setMobileNav(!mobileNav);
          setHamburgerOpen(!hamburgerIsOpen);
        }}
        className={
            // (mobileNav ? "fixed right-[.5rem] top-[1.1rem] " : "block ") +
            "sm:hidden z-20 rounded focus:outline-none"
        }
      >
        <Hamburger
          duration={0.5}
          toggled={hamburgerIsOpen}
          toggle={setHamburgerOpen}
        />
      </button>

      <div
        className={
          mobileNav
            ? "fixed h-screen top-0 mt-[4rem] bottom-0 right-0 bg-background w-3/6 z-10 sm:hidden ease-in duration-200"
            : "fixed h-screen top-0 mt-[4rem] bottom-0 right-[-100%] bg-background w-3/6 z-10 sm:hidden ease-in duration-200"
        }
      >
        {/* Mobile navigation dropdown */}
        <ul className="flex flex-col bg-blue-500 items-center w-full text-base pt-5">
        <div className="px-4">

        <Web3Button/> 
        </div>

          <Link href="/" className="w-full mt-5 text-white opacity-80 font-semibold">
            <li
              className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer"
              onClick={() => {
                setMobileNav(false);
                setHamburgerOpen(false);
              }}
            >
              Home
            </li>
          </Link>

          <Link
            href="/problems"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Problems
            </li>
          </Link>

          <Link
            href="/solutions"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Solutions
            </li>
          </Link>

        </ul>
      </div>

      <div className="items-center gap-4 hidden sm:flex p-3">
      <Link href="/" className="nav__link">
          Home
        </Link>
        <Link href="/problems" className="nav__link">
          Problems
        </Link>

        <Link href="/solutions" className="nav__link">
          Solutions
        </Link>


        <Web3Button /> 

      </div>
    </nav>
  );
}
