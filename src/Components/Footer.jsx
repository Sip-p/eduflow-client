import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white  py-6   bottom-0 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0 flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">EduFlow</span>
        </div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="hover:text-blue-400 text-xl" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="hover:text-blue-400 text-xl" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="hover:text-pink-400 text-xl" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="hover:text-blue-600 text-xl" />
          </a>
        </div>
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer