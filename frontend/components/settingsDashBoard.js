"use client";

import { FaSignOutAlt } from "react-icons/fa";
import BlogTabs from "./blogTabs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, setCredentials } from "@/slices/authSlice";
import { useEffect, useState } from "react";
import { useAuthHook } from "@/hooks/setAuthHook";

function SettingsDashBoard() {
  // const [authChecked, setAuthChecked] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const authChecked = useAuthHook();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedUser = localStorage.getItem("user");
  //     const storedToken = localStorage.getItem("token");

  //     if (storedUser && storedToken) {
  //       dispatch(
  //         setCredentials({ user: JSON.parse(storedUser), token: storedToken })
  //       );
  //     }
  //     setAuthChecked(true);
  //   }
  // }, [dispatch]);

  useEffect(() => {
    if (!authChecked && !user) {
      router.push("/");
    }
  }, [authChecked, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!user) return null;
  return (
    <div className="grid grid-cols-9 min-h-[84vh] bg-slate-900 text-cyan-50">
      <div className="flex flex-col justify-between p-4 col-span-2 border-r border-slate-700 bg-slate-950 text-sm sm:text-xl text-center">
        <span className="font-semibold">Blogs</span>
        <button
          onClick={handleLogout}
          type="button"
          className="flex flex-col items-center gap-2 hover:text-orange-500 transition duration-300 ease-in-out"
        >
          Logout <FaSignOutAlt className="text-orange-500" />
        </button>
      </div>

      <div className="col-span-7 p-6">
        <BlogTabs />
      </div>
    </div>
  );
}

export default SettingsDashBoard;
