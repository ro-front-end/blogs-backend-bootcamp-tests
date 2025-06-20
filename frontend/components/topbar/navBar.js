"use client";
import { FaUser } from "react-icons/fa";
import BurgerMenu from "./burgerMenu";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import Link from "next/link";
import { useAuthHook } from "@/hooks/setAuthHook";

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const menuRef = useRef(null);

  useAuthHook();

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        handleCloseMenu();
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (!user) {
    return null;
  }

  return (
    <nav className="flex justify-between items-center w-full mx-auto">
      <Logo handleCloseMenu={handleCloseMenu} />
      <div className="flex gap-6 justify-center">
        <Link
          id="settings-link"
          onClick={handleCloseMenu}
          href="/settings"
          className="flex justify-end gap-2 items-center"
        >
          <FaUser className="bg-orange-500 text-xl p-1 rounded-full" />{" "}
          <span className="text-cyan-400 hover:text-orange-400 transition duration-300">
            {user.username}
          </span>
        </Link>
        <BurgerMenu
          menuRef={menuRef}
          showMenu={showMenu}
          handleCloseMenu={handleCloseMenu}
          handleToggleMenu={handleToggleMenu}
        />
      </div>
    </nav>
  );
}

export default NavBar;
