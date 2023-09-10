// import necessary dependencies and components
"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function DemoInstructions() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <></>;

  return (
    <div className="h-screen overflow-x-hidden bg-gradient-to-br from-white via-transparent to-tech-blue dark:bg-neutral-gray dark:from-neutral-gray dark:via-neutral-gray dark:to-tech-blue">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center p-10 flex-col md:flex-row text-center">
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-5xl text-tech-blue font-bold ">
              Prototype Instructions
            </h1>
            <p className="text-2xl">
              Follow the steps below to setup and use the prototype.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 py-1 px-5 text-left lg:py-0">
          <h2 className="text-3xl font-bold mb-2">Setup & Usage</h2>
          <ol className="list-decimal max-w-xl mx-auto gap-8 py-2">
            <li className="flex flex-col items-start gap-0">
              <h3 className="text-xl font-semibold">Get a Digital Wallet</h3>
              <ul className="list-disc pl-2">
                <li>
                  You'll need a digital wallet. If you don't have one, download{" "}
                  <Link
                    href="https://metamask.io/download/"
                    className="text-tech-blue underline"
                  >
                    MetaMask
                  </Link>
                  .
                </li>
                <li>
                  If you're on a computer (and not on a phone), you'll open the
                  wallet via its browser extension. On a phone, it operates as a
                  separate app.
                </li>
              </ul>
            </li>
            <li className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold mt-5">
                Enable Test Networks in MetaMask
              </h3>
              <ul className="list-disc pl-2">
                <li>
                  Open MetaMask and access the wallet by clicking on its browser
                  extension icon.
                </li>
                <li>Head to 'Settings', then 'Advanced'.</li>
                <li>
                  Ensure 'Show test networks' is turned on to access testnets.
                </li>
              </ul>
            </li>
            <li className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold mt-5">
                Add the Fantom Testnet to Your Wallet
              </h3>
              <ul className="list-disc pl-2">
                <li>In MetaMask, go to 'Networks'.</li>
                <li>Click on 'Add network'.</li>
                <li>Choose 'Add a network manually'.</li>
                <li>Fill out the details:</li>
                <ul className="pl-2">
                  <li>
                    <strong>Network Name</strong>: Fantom testnet
                  </li>
                  <li>
                    <strong>RPC Url</strong>:
                    `https://rpc.testnet.fantom.network/` (Please copy this,
                    don't click on it.)
                  </li>
                  <li>
                    <strong>ChainID</strong>: 0xfa2
                  </li>
                  <li>
                    <strong>Symbol</strong>: FTM
                  </li>
                  <li>
                    <strong>Block Explorer URL</strong>:
                    `https://testnet.ftmscan.com/` (Again, copy this, don't
                    click.)
                  </li>
                </ul>
                <li>Click 'Save'.</li>
              </ul>
            </li>
            <li className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold mt-5">
                Switch to the Fantom Testnet
              </h3>
              <ul className="list-disc pl-2">
                <li>
                  Once you've added the Fantom testnet, switch to it. Head to
                  the network selector at the top of the MetaMask homepage.
                  Scroll until you find 'Fantom testnet' and select it.
                </li>
              </ul>
            </li>
            <li className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold mt-5">
                Get Some Test Money (FTM)
              </h3>
              <ul className="list-disc pl-2">
                <li>Before using the prototype, you need test money (FTM).</li>
                <li>
                  First, find your account address in MetaMask. It starts with
                  "0X" followed by letters and numbers.
                </li>
                <li>Click on the address to copy it.</li>
                <li>
                  Go to the{" "}
                  <Link
                    href="https://faucet.fantom.network/"
                    className="text-tech-blue underline"
                  >
                    Fantom faucet
                  </Link>
                  .
                </li>
                <li>Paste your address and click 'request'.</li>
              </ul>
            </li>
            <li className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-semibold mt-5">
                Connect Your Wallet to the Website
              </h3>
              <ul className="list-disc pl-2">
                <li>
                  Once you're on the prototype website, find the "connect
                  wallet" button. It's usually located at the top of the page.
                </li>
                <li>
                  Click on it to link your MetaMask wallet to the website.
                </li>
                <li>
                  Remember: Whenever you perform actions on the website, a popup
                  will appear from your wallet asking for your approval.
                </li>
              </ul>
            </li>
          </ol>
        </div>
        <div className="flex flex-col items-center py-5 px-5 text-center lg:py-5">
          <h2 className="text-4xl font-bold mb-2">Ready to Dive In?</h2>
          <p className="max-w-lg mb-4">
            Now that you're all set up, explore the prototype and experience the
            functionalities firsthand!
          </p>
          <Link href="/">
            <button className="btn-primary">Start the Prototype</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
