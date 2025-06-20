"use client";

import { loginUserThunk } from "@/slices/authSlice";
import { initialValues, loginSchema } from "@/validations/loginValidation.form";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function LoginForm() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(loginUserThunk(values));
      resetForm();
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/blogs");
    }
  }, [user, router]);

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0) {
      const timer = setTimeout(() => {
        formik.setErrors({});
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [formik]);

  const handleNotRegistered = () => {
    router.push("/signup");
  };

  return (
    <div>
      <form
        className="right-0 p-8 bg-gradient-to-br from-slate-900 to-cyan-950 text-white shadow-2xl rounded-2xl w-full max-w-lg animate-fade-in mx-auto mt-12"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-xl font-semibold text-cyan-500 mb-12">
          Login to Post Blogs!
        </h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <input
              className="bg-cyan-50 p-4 rounded-xl w-full border border-cyan-50 focus:border-cyan-300 outline-none text-cyan-950"
              type="text"
              placeholder="Type username..."
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              id="username"
            />
            {formik.errors.username && (
              <div className="text-orange-700">{formik.errors.username}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              className="bg-cyan-50 p-4 rounded-xl w-full border border-cyan-50 focus:border-cyan-300 outline-none text-cyan-950"
              type="password"
              placeholder="Type password..."
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              id="password"
            />
            {formik.errors.password && (
              <div className="text-orange-700">{formik.errors.password}</div>
            )}
          </div>
          <button
            className="bg-cyan-500 p-4 rounded-xl w-full font-semibold text-cyan-50 mt-8 hover:bg-cyan-600 transition-all duration-300 ease-in-out"
            type="submit"
            id="login-button"
          >
            {loading ? "logging in" : "Login"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-slate-500 p-4 rounded-xl w-full font-semibold text-cyan-50 hover:bg-slate-600 transition-all duration-300 ease-in-out"
            type="button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNotRegistered}
            className="text-slate-300 hover:text-cyan-400"
          >
            Not registered yet?
          </button>
          {error && <div className="text-orange-700">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
