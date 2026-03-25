// components/Footer.tsx
import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-10 px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">


        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Raghav Sahil Sanjeev Sarthak
          </h2>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-500">
            git commit -m "Footer"
          </p>
        </div>

        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/Sarthak1970/Campus_Network_Complaint_System"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Network Complaints • All rights reserved
      </div>
    </footer>
  );
};

export default Footer;