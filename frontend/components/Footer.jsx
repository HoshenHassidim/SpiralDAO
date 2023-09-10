import React from "react";
import { FaTelegramPlane } from "react-icons/fa"; // For the Telegram icon

const Footer = () => {
  return (
    <div>
      <div className="py-5"></div>
      <footer className="bg-tech-blue text-sm text-white py- px-8 sm:fixed bottom-0 w-full z-20 hidden sm:block">
        <div className="container mx-auto flex flex-row justify-around items-center">
          {/* Join the community section */}
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <FaTelegramPlane size={18} />
            <a
              href="https://t.me/SPIRAL_DAO"
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
    </div>
  );
};

export default Footer;
