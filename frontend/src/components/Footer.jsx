import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 ">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">About the Hub</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            We are dedicated to fostering innovation, supporting research, and
            helping start-ups grow. Our mission is to empower creators,
            thinkers, and entrepreneurs to bring their ideas to life.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <a href="#research" className="hover:underline">
                Research Projects
              </a>
            </li>
            <li>
              <a href="#ipr" className="hover:underline">
                IPR Management
              </a>
            </li>
            <li>
              <a href="#innovation" className="hover:underline">
                Innovation Tracker
              </a>
            </li>
            <li>
              <a href="#startup" className="hover:underline">
                Start-up Hub
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded bg-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded bg-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows="3"
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded bg-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Research & Innovation Hub. All
          rights reserved.
        </p>
        <p>West Bengal, India</p>
      </div>
    </footer>
  );
};

export default Footer;
