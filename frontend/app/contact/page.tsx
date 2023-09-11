// import necessary dependencies and components
"use client";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <div className="h-screen overflow-x-hidden bg-gradient-to-br from-white via-transparent to-tech-blue dark:bg-neutral-gray dark:from-neutral-gray dark:via-neutral-gray dark:to-tech-blue">
      <Navbar />

      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center p-10 flex-col md:flex-row text-center">
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-5xl text-tech-blue font-bold">
              Contact Us
            </h1>
            <p className="text-2xl">
              Reach out to us via email or join our Telegram community.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 py-5 px-5 text-center">
          <h2 className="text-3xl font-bold mb-5">Contact Options</h2>

          {/* Telegram Link */}
          <div className="mb-5">
            <a
              href="https://t.me/HoshenHassidim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tech-blue hover:underline text-2xl"
            >
              Send us an Telegram message
            </a>
          </div>

          {/* Email Link */}
          <div>
            <a
              href="mailto:hoshen321@gmail.com"
              className="text-tech-blue hover:underline text-2xl"
            >
              Send us an Email
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
