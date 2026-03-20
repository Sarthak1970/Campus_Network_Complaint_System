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
    <footer className="bg-black text-gray-300 py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Sarthak</h2>
          <p className="text-sm mt-1 opacity-80">
            git commit -m &quot;Footer&quot;
          </p>
        </div>


        {/* <ul className="flex gap-6 text-sm">
          <li className="hover:text-white transition-colors cursor-pointer">
            Home
          </li>
          <li className="hover:text-white transition-colors cursor-pointer">
            Projects
          </li>
          <li className="hover:text-white transition-colors cursor-pointer">
            About
          </li>
          <li className="hover:text-white transition-colors cursor-pointer">
            Contact
          </li>
        </ul> */}

        {/* Social Icons */}
        <div className="flex gap-5 text-xl">
          <a
            href="https://www.instagram.com/__sarthak2910"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/Sfaceserror"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <FaTwitter />
          </a>
          {/* <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <FaFacebookF />
          </a> */}
          <a
            href="https://www.linkedin.com/in/sarthak-katiyar-598159293/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://github.com/Sarthak1970"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <FaGithub />
          </a>
        </div>
      </div>

      {/* Copyright
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()}  </div> */}
    </footer>
  );
};

export default Footer;
