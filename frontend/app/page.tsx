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
  const [isHowItWorksExpanded, setHowItWorksExpanded] = useState(true);

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
            The Future of Collaborative Innovation
          </h1>
          <p className="max-w-auto text-2xl">
            Engage with Innovators. Collaborate on Ideas. Find Opportunities.
            Create the Future. Together
          </p>

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
          <h2 className="text-4xl font-bold">Why We're Here</h2>
          {/* <button
            onClick={toggleBriefOverview}
            className="text-tech-blue text-sm border border-tech-blue px-2 py-1 rounded"
          >
            {isBriefOverviewExpanded ? "Hide" : "Show"}
          </button> */}
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
                <h3 className="text-xl font-semibold">Spot a Challenge</h3>
                <p>
                  Spot challenges that impact many or suggest a problem you've
                  noticed.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold">Engage & Rate</h3>
                <p>
                  Challenges are up for voting on the Engage page. Help pick the
                  pressing ones.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold">Solution Proposals</h3>
                <p>
                  Top-rated challenges enter the solution phase. Pitch ideas and
                  evaluate others.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-semibold">Project Creation</h3>
                <p>
                  Selected solutions evolve into projects. Managers add tasks
                  and the building starts!
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">5</span>
                </div>
                <h3 className="text-xl font-semibold">Role Proposals</h3>
                <p>
                  Step up! Offer to manage projects or take on tasks. Members
                  vote on who fits best for each role.
                </p>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">6</span>
                </div>
                <h3 className="text-xl font-semibold">Open Opportunities</h3>
                <p>
                  Check out the Opportunities page. All open tasks and projects
                  await your proposals.
                </p>
              </div>

              {/* Step 7 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">7</span>
                </div>
                <h3 className="text-xl font-semibold">Task Verification</h3>
                <p>
                  Once a task is finished, the community reviews it. Upon
                  positive feedback, the task is marked as completed.
                </p>
              </div>

              {/* Step 8 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">8</span>
                </div>
                <h3 className="text-xl font-semibold">
                  Token Rewards & Compensation
                </h3>
                <p>
                  Everyone, from challenge and solution proposers to project
                  managers and task performers, receives both project tokens and
                  additional Spiral DAO platform tokens.
                </p>
              </div>

              {/* Step 9 */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-tech-blue">
                  <span className="text-3xl font-bold text-white">9</span>
                </div>
                <h3 className="text-xl font-semibold">Your Dashboard</h3>
                <p>
                  Track all your problems, solutions, projects, tasks and
                  rewards in one place.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Demo/Prototype Highlights */}
        <div className="flex flex-col items-center py-1 px-5 section-padding text-center lg:py-5">
          <h2 className="text-4xl font-bold mb-2">Inside the Prototype</h2>
          <p className="max-w-lg mb-4">
            Take a sneak peek into our platform's capabilities. Your feedback
            shapes its evolution, adapting it closer to real-world needs.
            <br />
            Do note that our prototype runs on the Fantom testnet, the products
            and tokens within have no real-world value — they're purely for
            exploration and feedback.
          </p>
          <Link href="/demoInstructions">
            <button className="btn-primary mb-3">Prototype Instructions</button>
          </Link>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLScnqhqIL0o_b2A79WHBftioGFg5z0wunPpLUaIFr_316K_9Qw/viewform?usp=sf_link">
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
