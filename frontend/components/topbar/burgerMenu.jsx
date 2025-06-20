"use client";

import Link from "next/link";
import { useState } from "react";
import { FaAddressBook, FaBlog, FaBook, FaEnvelope } from "react-icons/fa";

function BurgerMenu({ showMenu, handleCloseMenu, handleToggleMenu, menuRef }) {
  return (
    <div className="relative flex justify-between">
      <button onClick={handleToggleMenu} className="flex flex-col">
        <span
          className={`w-4 h-1 bg-cyan-500 mb-[.2rem] transition-all duration-300 ease-in-out ${
            showMenu ? "rotate-45 translate-y-[.4rem] bg-orange-700" : ""
          }`}
        ></span>
        <span
          className={`w-4 h-1 bg-cyan-500 mb-[.2rem] transition-all duration-300 ease-in-out ${
            showMenu ? "bg-opacity-0" : ""
          }`}
        ></span>
        <span
          className={`w-4 h-1 bg-cyan-500  transition-all duration-300 ease-in-out ${
            showMenu ? "-rotate-45 -translate-y-2 bg-orange-700" : ""
          }`}
        ></span>
      </button>
      {showMenu ? (
        <ul
          ref={menuRef}
          className="flex flex-col gap-6 absolute bg-cyan-700 text-cyan-50 py-6 px-8 top-6 right-0 z-20"
        >
          <li
            onClick={handleCloseMenu}
            className="flex justify-start gap-6 items-center w-full border-b-[.1rem] pb-1 hover:text-orange-400 hover:border-orange-400 transition duration-300 ease-in-out"
          >
            <FaBlog className="" />
            <Link className="" href="/blogs">
              Blogs
            </Link>
          </li>

          <li
            onClick={handleCloseMenu}
            className="flex justify-start gap-6 items-center w-full border-b-[.1rem] pb-1 hover:text-orange-400 hover:border-orange-400 transition duration-300 ease-in-out"
          >
            <FaBook className="" />
            <Link className="" href="/about">
              About
            </Link>
          </li>

          <li
            onClick={handleCloseMenu}
            className="flex justify-start gap-6 items-center w-full border-b-[.1rem] pb-1 hover:text-orange-400 hover:border-orange-400 transition duration-300 ease-in-out"
          >
            <FaEnvelope className="" />
            <Link className="" href="/contact">
              Contact
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export default BurgerMenu;
