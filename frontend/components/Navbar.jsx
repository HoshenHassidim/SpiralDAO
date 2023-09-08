import React, { useState, useEffect, useRef } from "react";
import { Turn as Hamburger } from "hamburger-react";
import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../app/_providers/ThemeContext";
import useOutsideClick from "./hooks/useOutsideClick";
import { useAccount } from "wagmi";

export default function Navbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { address, isConnected } = useAccount();

  // Effect to add/remove the dark class to/from the body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const [isEngageOpen, setEngageOpen] = useState(false);
  const [isOpportunitiesOpen, setOpportunitiesOpen] = useState(false);

  const engageRef = useRef(null);
  const opportunitiesRef = useRef(null);

  useOutsideClick(engageRef, () => {
    if (isEngageOpen) setEngageOpen(false);
  });

  useOutsideClick(opportunitiesRef, () => {
    if (isOpportunitiesOpen) setOpportunitiesOpen(false);
  });

  return (
    <nav className="flex justify-between items-center p-1 px-5 sticky top-0 drop-shadow-lg bg-blue-500 z-20 backdrop-blur-lg bg-opacity-30">
      <a className="logo-a" href="/">
        {/* <h1 className="text-xl font-bold">SpiralDAO</h1> */}
        <Image
          src="/assets/spiral_logo.png"
          className="cursor-pointer max-w-md z-30"
          href="/"
          width={40}
          height={40}
          alt="SpiralDAO Logo"
        />
      </a>

      {/* Web3Button for mobile - Only displayed on small screens */}
      <div className="sm:hidden">
        <Web3Button />
      </div>

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
          {/* Theme Switch */}
          <div className="ml-5">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={theme === "dark"}
                  onChange={(e) =>
                    setTheme(e.target.checked ? "dark" : "light")
                  }
                />
                <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-white font-medium">
                Dark Mode
              </div>
            </label>
          </div>

          <Link
            href="/"
            className="w-full mt-5 text-white opacity-80 font-semibold"
          >
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
            href="/engage"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Engage
            </li>
          </Link>

          <Link
            href="/opportunities"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Opportunities
            </li>
          </Link>

          <Link
            href="/projects"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Projects
            </li>
          </Link>

          {isConnected && (
            <Link
              href="/dashboard"
              className="w-full text-white opacity-80 font-semibold"
            >
              <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
                Dashboard
              </li>
            </Link>
          )}
        </ul>
      </div>

      {/* Desktop navigation links  */}
      <div className="hidden items-center gap-1 sm:flex p-1">
        {/* Engage Button Link */}
        <Link
          href="/engage"
          className="text-xl font-semibold hover:text-white text-democracy-beige px-3 py-1 hover:bg-tech-blue rounded-md"
        >
          Engage
        </Link>

        {/* Opportunities Button Link */}
        <Link
          href="/opportunities"
          className="text-xl font-semibold hover:text-white text-democracy-beige px-3 py-1 hover:bg-tech-blue rounded-md"
        >
          Opportunities
        </Link>

        {/* Projects Button Link */}
        <Link
          href="/projects"
          className="text-xl font-semibold hover:text-white text-democracy-beige px-3 py-1 hover:bg-tech-blue rounded-md"
        >
          Projects
        </Link>

        {/* Dashboard Button Link */}
        {isConnected && (
          <Link
            href="/dashboard"
            className="text-xl font-semibold hover:text-white text-democracy-beige px-3 py-1 hover:bg-tech-blue rounded-md"
          >
            Dashboard
          </Link>
        )}

        {/* Engage Dropdown Menu */}
        {/* <div
          className="relative group hover:bg-blue-600 rounded-md"
          ref={engageRef}
        >
          <button
            className="text-xl font-semibold text-white px-3 py-1"
            onClick={() => {
              setEngageOpen(!isEngageOpen);
              setOpportunitiesOpen(false);
            }}
          >
            Engage
          </button>
          {isEngageOpen && (
            <div className="absolute left-0 w-48 text-base z-10 bg-white dark:bg-neutral-gray dark:text-white rounded-md">
              <Link
                href="/engage"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                All Problems
              </Link>
              <Link
                href="/problems-awaiting-ranking"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                Problems Awaiting Ranking
              </Link>
              <Link
                href="/problems-in-solution-phase"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                Problems in Solution Phase
              </Link>
            </div>
          )}
        </div> */}

        {/* Opportunities Dropdown Menu */}
        {/* <div
          className="relative group hover:bg-blue-600 rounded-md"
          ref={opportunitiesRef}
        >
          <button
            className="text-xl font-semibold text-white px-3 py-1"
            onClick={() => {
              setOpportunitiesOpen(!isOpportunitiesOpen);
              setEngageOpen(false);
            }}
          >
            Opportunities
          </button>
          {isOpportunitiesOpen && (
            <div className="absolute left-0 w-48 text-base z-10 bg-white dark:bg-neutral-gray  dark:text-white rounded-md">
              <Link
                href="/opportunities"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                All Opportunities
              </Link>
              <Link
                href="/management-opportunities"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                Management Opportunities
              </Link>
              <Link
                href="/task-opportunities"
                className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-tech-blue nav__link"
              >
                Task Opportunities
              </Link>
            </div>
          )}
        </div> */}

        {/* Search Bar */}
        {/* <div className="ml-10 relative">
          <input
            className="bg-white pl-10 pr-4 py-2 rounded-lg shadow-md w-72 focus:outline-none"
            type="text"
            placeholder="Search"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <i className="fa fa-search text-gray-500" aria-hidden="true"></i>
          </div>
        </div> */}

        {/* Theme Switch */}
        <div className="ml-5">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="hidden"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
              />
              <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
            </div>
            <div className="ml-3 text-gray-700 dark:text-white font-medium">
              Dark Mode
            </div>
          </label>
        </div>

        {/* Profile Icon/Name */}
        <div className="ml-10 flex items-center gap-4">
          <Web3Button />
          {/* <div className="flex items-center cursor-pointer">
            <span className="text-base text-white">Profile</span>
            <Image
              src="/assets/profile_icon.png"
              width={40}
              height={40}
              alt="Profile Icon"
            />
          </div> */}
        </div>
      </div>

      {/* ... Rest of your Desktop Navbar ... */}
    </nav>
  );
}
