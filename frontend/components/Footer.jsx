import React from "react";
import { FaTelegramPlane } from "react-icons/fa"; // For the Telegram icon

const Footer = () => {
  return (
    <footer className="bg-tech-blue text-white py-6 px-8">
      <div className="container mx-auto flex flex-col sm:flex-row justify-around items-center">
        {/* Join the community section */}
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <FaTelegramPlane size={24} />
          <a
            href="https://telegram.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Join the community
          </a>
        </div>

        {/* Feedback section */}
        <div className="mb-2 sm:mb-0">
          <a
            href="https://docs.google.com/forms/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Give us Feedback
          </a>
        </div>

        {/* Contact us section */}
        <div>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
