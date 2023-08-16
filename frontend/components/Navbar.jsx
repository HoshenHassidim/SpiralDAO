// import React, { useState, useEffect } from "react";
// import { Turn as Hamburger } from "hamburger-react";
// import { Web3Button } from "@web3modal/react";
// import Link from "next/link";
// import Image from "next/image";
// import { useTheme } from "../app/_providers/ThemeContext";

// export default function Navbar() {
//   const [mobileNav, setMobileNav] = useState(false);
//   const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
//   const { theme, setTheme } = useTheme();

//   // Effect to add/remove the dark class to/from the body
//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark");
//     } else {
//       document.body.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleMobileNav = () => {
//     setMobileNav(!mobileNav);
//     setHamburgerOpen(!hamburgerIsOpen);
//   };

//   return (
//     <nav className="flex justify-between items-center p-2 px-5 sticky top-0 drop-shadow-lg bg-blue-500 z-20 backdrop-filter backdrop-blur-lg bg-opacity-30">
//       <a className="logo-a" href="/">
//         <Image
//           src="/assets/spiral_logo.png"
//           className="cursor-pointer max-w-md z-30"
//           href="/"
//           width={50}
//           height={50}
//           alt="SpiralDAO Logo"
//         />
//       </a>

//       <div className="flex items-center gap-10">
//         {/* Dropdown Menu */}
//         <div className="relative group hover:bg-blue-600 rounded-md">
//           <button className="text-2xl font-semibold text-white px-4 py-2">
//             Engage
//           </button>
//           <div className="absolute left-0 mt-2 w-48 text-base z-10 group-hover:block hidden bg-white dark:bg-neutral-gray rounded-md">
//             <Link
//               href="/problems"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               All Problems
//             </Link>
//             <Link
//               href="/problems-awaiting-ranking"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               Problems Awaiting Ranking
//             </Link>
//             <Link
//               href="/problems-in-solution-phase"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               Problems in Solution Phase
//             </Link>
//           </div>
//         </div>

//         {/* Engage Dropdown */}
//         <div className="relative group">
//           <button className="text-2xl font-semibold text-white">Engage</button>
//           <div className="absolute left-0 mt-2 w-48 text-base z-10 group-hover:block hidden bg-white dark:bg-neutral-gray">
//             <Link
//               href="/problems"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               All Problems
//             </Link>
//             <Link
//               href="/problems-awaiting-ranking"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               Problems Awaiting Ranking
//             </Link>
//             <Link
//               href="/problems-in-solution-phase"
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               Problems in Solution Phase
//             </Link>
//           </div>
//         </div>

//         {/* ... Similar Dropdown for Opportunities, Projects, and More ... */}

//         {/* Search Bar */}
//         <div className="ml-10 relative">
//           <input
//             className="bg-white pl-10 pr-4 py-2 rounded-lg shadow-md w-72 focus:outline-none"
//             type="text"
//             placeholder="Search"
//           />
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//             <i className="fa fa-search text-gray-500" aria-hidden="true"></i>
//           </div>
//         </div>

//         {/* Theme Switch */}
//         <div className="ml-5">
//           <label className="flex items-center cursor-pointer">
//             <div className="relative">
//               <input
//                 type="checkbox"
//                 className="hidden"
//                 checked={theme === "dark"}
//                 onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
//               />
//               <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
//               <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
//             </div>
//             <div className="ml-3 text-gray-700 dark:text-white font-medium">
//               Dark Mode
//             </div>
//           </label>
//         </div>

//         {/* Profile Icon/Name */}
//         <div className="ml-10 flex items-center gap-4">
//           <Web3Button />
//           {/* <div className="flex items-center cursor-pointer">
//             <span className="text-base text-white">Profile</span>
//             <Image
//               src="/assets/profile_icon.png"
//               width={40}
//               height={40}
//               alt="Profile Icon"
//             />
//           </div> */}
//         </div>
//       </div>

//       {/* ... Rest of your Desktop Navbar ... */}

//       {/* Hamburger Icon & Mobile Navigation */}
//       <button onClick={toggleMobileNav} className="hamburger">
//         <Hamburger toggled={hamburgerIsOpen} toggle={setHamburgerOpen} />
//       </button>
//       <div className={`nav-mobile ${mobileNav ? "nav-mobile-active" : ""}`}>
//         {/* Mobile navigation dropdown */}
//         <ul className="flex flex-col bg-blue-500 items-center w-full text-base pt-5">
//           <div className="px-4">
//             <Web3Button />
//           </div>

//           <Link
//             href="/"
//             className="w-full mt-5 text-white opacity-80 font-semibold"
//           >
//             <li
//               className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer"
//               onClick={() => {
//                 setMobileNav(false);
//                 setHamburgerOpen(false);
//               }}
//             >
//               Home
//             </li>
//           </Link>

//           <Link
//             href="/problems"
//             className="w-full text-white opacity-80 font-semibold"
//           >
//             <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
//               Problems
//             </li>
//           </Link>

//           <Link
//             href="/projects"
//             className="w-full text-white opacity-80 font-semibold"
//           >
//             <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
//               Projects
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// {/* Desktop navigation links  */}
// <div className="items-center gap-4 hidden sm:flex p-3">
//   <Link href="/" className="nav__link">
//     Home
//   </Link>
//   <Link href="/problems" className="nav__link">
//     Problems
//   </Link>

//   <Link href="/projects" className="nav__link">
//     Projects
//   </Link>

//   <Web3Button />
// </div>

import React, { useState, useEffect } from "react";
import { Turn as Hamburger } from "hamburger-react";
import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../app/_providers/ThemeContext";

export default function Navbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Effect to add/remove the dark class to/from the body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

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
            <Web3Button />
          </div>

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
            href="/problems"
            className="w-full text-white opacity-80 font-semibold"
          >
            <li className="hover:bg-gray-500 py-4 px-6 w-full cursor-pointer">
              Problems
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
        </ul>
      </div>

      {/* Desktop navigation links  */}
      <div className="hidden items-center gap-4 sm:flex p-3">
        {/* Dropdown Menu */}
        <div className="relative group hover:bg-blue-600 rounded-md">
          <button className="text-2xl font-semibold text-white px-4 py-2">
            Engage
          </button>
          <div className="absolute left-0 mt-2 w-48 text-base z-10 group-hover:block hidden bg-white dark:bg-neutral-gray rounded-md">
            <Link
              href="/problems"
              className="block px-4 py-2 hover:bg-gray-100 nav__link"
            >
              All Problems
            </Link>
            <Link
              href="/problems-awaiting-ranking"
              className="block px-4 py-2 hover:bg-gray-100 nav__link"
            >
              Problems Awaiting Ranking
            </Link>
            <Link
              href="/problems-in-solution-phase"
              className="block px-4 py-2 hover:bg-gray-100 nav__link"
            >
              Problems in Solution Phase
            </Link>
          </div>
        </div>

        {/* Engage Dropdown */}
        <div className="relative group">
          <button className="text-2xl font-semibold text-white">Engage</button>
          <div className="absolute left-0 mt-2 w-48 text-base z-10 group-hover:block hidden bg-white dark:bg-neutral-gray">
            <Link
              href="/problems"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              All Problems
            </Link>
            <Link
              href="/problems-awaiting-ranking"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Problems Awaiting Ranking
            </Link>
            <Link
              href="/problems-in-solution-phase"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Problems in Solution Phase
            </Link>
          </div>
        </div>

        {/* ... Similar Dropdown for Opportunities, Projects, and More ... */}

        {/* Search Bar */}
        <div className="ml-10 relative">
          <input
            className="bg-white pl-10 pr-4 py-2 rounded-lg shadow-md w-72 focus:outline-none"
            type="text"
            placeholder="Search"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <i className="fa fa-search text-gray-500" aria-hidden="true"></i>
          </div>
        </div>

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
