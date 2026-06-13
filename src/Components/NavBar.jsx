import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* my Logo goes here */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">☁️</span>

          <h1 className="text-2xl font-bold">
            WeatherApp
          </h1>
        </div>

        {/* Desktop Navigation will look like this */}
        <ul className="hidden md:flex items-center gap-8">
          <li className="hover:text-blue-400 cursor-pointer transition">
            Home
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            Forecast
          </li>

          <li className="hover:text-blue-400 cursor-pointer transition">
            About
          </li>
        </ul>

        {/* This will be the Desktop Search */}
        <div className="hidden md:flex items-center gap-3">

          <input
            type="text"
            placeholder="Search city..."
            className="px-4 py-2 rounded-lg text-black outline-none w-64"
          />

          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
            Search
          </button>
        </div>

        {/* Here are my Mobile Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6">

          <ul className="flex flex-col gap-4 mb-4">
            <li className="hover:text-blue-400 cursor-pointer">
              Home
            </li>

            <li className="hover:text-blue-400 cursor-pointer">
              Forecast
            </li>

            <li className="hover:text-blue-400 cursor-pointer">
              About
            </li>
          </ul>

          {/* Mobile Search */}
          <div className="flex flex-col gap-3">

            <input
              type="text"
              placeholder="Search city..."
              className="px-4 py-2 rounded-lg text-black outline-none"
            />

            <button className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition">
              Search
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar