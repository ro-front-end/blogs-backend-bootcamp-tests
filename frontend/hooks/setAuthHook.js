import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, setCredentials } from "@/slices/authSlice";

export function useAuthHook() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, token } = useSelector((state) => state.auth);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedExpiration = localStorage.getItem("tokenExpiration");

      if (storedUser && storedToken && storedExpiration) {
        const isExpired = Date.now() > parseInt(storedExpiration, 10);

        if (isExpired) {
          dispatch(logout());
        } else {
          dispatch(
            setCredentials({
              user: JSON.parse(storedUser),
              token: storedToken,
            })
          );
        }
      } else {
        dispatch(logout());
      }
      setLocalStorageChecked(true);
    }
  }, [dispatch, router]);

  const authChecked = localStorageChecked && !!user && !!token;

  return authChecked;
}
