"use client";

// import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import Image from "next/image";
// import { useAccount } from "wagmi";
// import GetProblemCounter from "../components/GetProblemCounter";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // const { address, isConnecting, isDisconnected } = useAccount();

  if (!mounted) return <></>;

  return (
    <div className="h-screen overflow-x-hidden bg-gradient-to-br from-background-white via-transparent to-tech-blue dark:bg-neutral-gray">
      <Navbar />

      {/* Hero Section */}
      <div className="flex justify-center items-center p-5 flex-col md:flex-row section-padding">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl text-tech-blue font-bold title">
            Empowering Solutions in the Digital Age
          </h1>
          <p className="max-w-md body-text">Connect. Collaborate. Create.</p>
          <button className="btn-primary btn-spacing">Start Engaging</button>
          <button className="btn-primary bg-white border-tech-blue text-tech-blue btn-spacing">
            Find Opportunities
          </button>
        </div>

        <div>
          {/* <Image
            src="/assets/spiral_hero_image.png"
            className="max-w-md z-30"
            width={450}
            height={450}
            alt="Spiral hero image"
          /> */}
        </div>
      </div>

      {/* Brief Overview */}
      <div className="flex flex-col gap-6 py-10 px-5 section-padding">
        {/* Interactive Infographics */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Add the <GetProblemCounter /> Component as required for interactive infographics */}
          {/* <GetProblemCounter className="w-full md:w-1/4" /> */}
          <div className="w-full md:w-3/4">
            <h2 className="text-3xl font-semibold text-neutral-gray dark:text-white subtitle">
              What We Do
            </h2>
            {/* Add the description and icons here */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 py-10 px-5 bg-tech-blue text-white section-padding">
        {/* ... Add your Footer Components here ... */}
      </div>
    </div>
  );
}

// "use client";

// import { Web3Button } from "@web3modal/react";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Image from "next/image";
// import { useAccount } from "wagmi";
// import GetProblemCounter from "../components/GetProblemCounter";

// export default function Home() {
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   // Address:
//   const { address, isConnecting, isDisconnected } = useAccount();

//   if (!mounted) return <></>;

//   return (
//     <div className="h-screen overflow-x-hidden bg-gradient-to-br from-white via-transparent to-[#3AB3D7]">
//       <Navbar />

//       {/* Hero Section */}
//       <div className="flex justify-center items-center p-5 flex-col md:flex-row">
//         <div className="flex flex-col gap-4">
//           <h1 className="text-5xl text-sky-400 font-bold mw">
//             Empowering Solutions in the Digital Age
//           </h1>
//           <p className="max-w-md">Connect. Collaborate. Create.</p>
//           <button className="bg-sky-400 rounded-3xl text-white p-2 text-bold w-40">
//             Start Engaging
//           </button>
//           <button className="bg-white border-sky-400 border rounded-3xl text-sky-400 p-2 text-bold w-40 mt-2">
//             Find Opportunities
//           </button>
//         </div>

//         <div>
//           <Image
//             src="/assets/spiral_hero_image.png"
//             className="max-w-md z-30"
//             width={450}
//             height={450}
//             alt="Spiral hero image"
//           />
//         </div>
//       </div>

//       {/* Brief Overview */}
//       <div className="flex flex-col gap-6 py-10 px-5">
//         {/* Interactive Infographics */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Add the <GetProblemCounter /> Component as required for interactive infographics */}
//           {/* <GetProblemCounter className="w-full md:w-1/4" /> */}
//           <div className="w-full md:w-3/4">
//             <h2 className="text-3xl font-semibold text-gray-800">What We Do</h2>
//             {/* Add the description and icons here */}
//           </div>
//         </div>
//       </div>

//       {/* Featured Problems & Solutions */}
//       {/* <div className="flex flex-col gap-4 py-10 px-5 bg-gray-100"> */}
//       {/* ... Add your Carousel or Grid Layout here ... */}
//       {/* </div> */}

//       {/* How It Works */}
//       {/* <div className="flex flex-col gap-4 py-10 px-5"> */}
//       {/* ... Add your Step-by-Step Guide here ... */}
//       {/* </div> */}

//       {/* Testimonials */}
//       {/* <div className="flex flex-col gap-4 py-10 px-5 bg-gray-100"> */}
//       {/* ... Add your Testimonials Slider or Carousel here ... */}
//       {/* </div> */}

//       {/* Footer */}
//       <div className="flex flex-col gap-4 py-10 px-5 bg-blue-500 text-white">
//         {/* ... Add your Footer Components here ... */}
//       </div>
//     </div>
//   );
// }

// import { Web3Button } from "@web3modal/react";
// import {useEffect, useState} from "react"

// // components
// import GetProblemCounter from "../components/GetProblemCounter";
// import Navbar from "../components/Navbar"

// import Image from "next/image";

// import { useAccount} from 'wagmi'

// export default function Home() {
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   //Address:
//   const { address, isConnecting, isDisconnected } = useAccount()

//   if(!mounted) return <></>

//   return (
//     <div className="h-screen overflow-x-hidden bg-gradient-to-br bg-gradient-135 from-white via-transparent to-[#3AB3D7]">
//       <Navbar />
//       {/* <div>{address}</div> */}
//       <div className="flex justify-center items-center p-5 flex-col md:flex-row">
//         <div className="flex flex-col gap-4">
//           <h1 className="text-5xl text-sky-400 font-bold mw">Welcome to SpiralDAO</h1>
//           <p className="max-w-md ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus veniam, sequi eius id voluptates incidunt facilis quidem reiciendis, iste tenetur iusto! Animi quia facilis deleniti. Sit in error impedit fugiat.</p>
//           {/* <button className="bg-sky-400 rounded-3xl text-white p-2 text-bold w-40">Join the DAO</button> */}
//           <Web3Button/>

//         </div>

//         <div>
//         <Image
//           src="/assets/spiral_hero_image.png"
//           className="max-w-md z-30"
//           width={450}
//           height={450}
//           alt="Spiral hero image"
//         />
//         </div>
//       </div>
//       {/* <GetProblemCounter /> */}
//     </div>
//   )

// }
