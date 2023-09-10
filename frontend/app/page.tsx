"use client";

// import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import {
  FaTelegramPlane,
  FaLightbulb,
  FaUsers,
  FaProjectDiagram,
} from "react-icons/fa";
import Footer from "../components/Footer";

// import Image from "next/image";
// import { useAccount } from "wagmi";
// import GetProblemCounter from "../components/GetProblemCounter";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // const { address, isConnecting, isDisconnected } = useAccount();
  const [isBriefOverviewExpanded, setBriefOverviewExpanded] = useState(true);
  const [isHowItWorksExpanded, setHowItWorksExpanded] = useState(false);

  const toggleBriefOverview = () => setBriefOverviewExpanded((prev) => !prev);
  const toggleHowItWorks = () => setHowItWorksExpanded((prev) => !prev);

  if (!mounted) return <></>;

  return (
    <div className="h-screen overflow-x-hidden bg-gradient-to-br from-white via-transparent to-tech-blue dark:bg-neutral-gray dark:from-neutral-gray dark:via-neutral-gray dark:to-tech-blue">
      <Navbar />
      {/* Hero Section */}
      <div className="flex justify-center items-center p-10 flex-col md:flex-row">
        <div className="flex flex-col sm:gap-10 gap-1">
          <h1 className="text-3xl sm:text-5xl text-tech-blue font-bold ">
            Empowering Solutions in the Digital Age
          </h1>
          <p className="max-w-md text-2xl">Connect. Collaborate. Create.</p>

          <Link
            href="/engage"
            className="btn-primary btn-spacing flex items-center justify-center"
          >
            Start Engaging
          </Link>
          <Link
            href="/engage"
            className="btn-primary btn-spacing flex items-center justify-center"
          >
            Find Opportunities
          </Link>
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

      <div>
        {/* Brief Overview */}
        <div className="flex flex-col items-center gap-0 py-1 px-5 section-padding text-center lg:py-0">
          <h2 className="text-4xl font-bold">Our Mission</h2>
          <button
            onClick={toggleBriefOverview}
            className="text-tech-blue text-sm border border-tech-blue px-2 py-1 rounded"
          >
            {isBriefOverviewExpanded ? "Hide" : "Show"}
          </button>
          {isBriefOverviewExpanded && (
            <p className="max-w-lg py-4 gap-1">
              Our platform is a dynamic community-driven space where anyone can
              highlight pressing challenges, propose innovative solutions, and
              collaboratively bring these solutions to life. It's a symbiosis of
              crowd wisdom and action, all fueled by a token-based incentive
              system.
            </p>
          )}
        </div>

        {/* How It Works Section */}
        <div className="flex flex-col items-center gap-0 py-1 px-5 section-padding text-center lg:py-5">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <button
            onClick={toggleHowItWorks}
            className="text-tech-blue text-sm border border-tech-blue px-2 py-1 rounded"
          >
            {isHowItWorksExpanded ? "Hide" : "Show"}
          </button>
          {isHowItWorksExpanded && (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-2">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold">Highlight Challenges</h3>
                <p>
                  Anyone can suggest a problem with just a title for the demo
                  (and more details in the full version).
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold">Rate & Validate</h3>
                <p>
                  Problems are listed on our Engage page. Rate them and help
                  determine which challenges truly matter.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold">Solutions Phase</h3>
                <p>
                  Approved problems shift into the solutions phase. Share your
                  ideas and rate others to decide the best approach.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-semibold">Project Initiation</h3>
                <p>
                  Winning solutions ascend to the Projects page, and the journey
                  from concept to creation begins.
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">5</span>
                </div>
                <h3 className="text-xl font-semibold">Role Nominations</h3>
                <p>
                  Take the lead! Nominate yourself for management or specific
                  tasks. Our community votes on who fits best.
                </p>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">6</span>
                </div>
                <h3 className="text-xl font-semibold">
                  Task Execution & Reward
                </h3>
                <p>
                  Complete tasks, earn feedback, and upon satisfactory
                  performance, receive tokens as rewards.
                </p>
              </div>

              {/* Step 7 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">7</span>
                </div>
                <h3 className="text-xl font-semibold">
                  Earning Spiral DAO Tokens
                </h3>
                <p>
                  Both managers and task executors earn an additional incentive
                  in platform tokens.
                </p>
              </div>

              {/* Step 8 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">8</span>
                </div>
                <h3 className="text-xl font-semibold">Your Dashboard</h3>
                <p>Track all your contributions and rewards in one place. </p>
              </div>
            </div>
          )}
        </div>

        {/* Demo/Prototype Highlights */}
        <div className="flex flex-col items-center py-1 px-5 section-padding text-center lg:py-5">
          <h2 className="text-4xl font-bold mb-2">Demo Highlights</h2>
          <p className="max-w-lg mb-4">
            Our current demo provides a snapshot of our platform's potential,
            designed to gather your invaluable feedback. While it reflects our
            foundational process, the real-world application will evolve based
            on community insights.
          </p>
          <Link href="/feedback">
            <button className="btn-primary">Give Feedback</button>
          </Link>
        </div>

        {/* Join Community */}
        <div className="flex flex-col items-center py-5 px-5 section-padding text-center lg:py-5">
          <h2 className="text-4xl font-bold mb-2">Join Our Community!</h2>
          <p className="max-w-lg mb-4">
            Stay updated, influence our direction, and be a vital part of
            shaping our collective future. Your voice is pivotal. Let's
            co-create!
          </p>
          <Link href="https://t.me/SPIRAL_DAO">
            <button className="btn-primary">Join Now</button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
