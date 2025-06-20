"use client";

import { signupUser } from "@/services/signupServices";
import {
  initialValues,
  signupSchema,
} from "@/validations/signupValidation.form";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await signupUser(values);
        resetForm();
        router.push("/login");
      } catch (error) {
        setError("Couldn't signup" || error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAlreadyRegistered = () => {
    router.push("/login");
  };

  return (
    <div>
      <form
        className="right-0  p-8 bg-gradient-to-br from-slate-900 to-cyan-950 text-white shadow-2xl rounded-2xl w-full max-w-lg animate-fade-in mx-auto mt-12"
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-xl font-semibold text-cyan-500 mb-12">
          Signup to start sharing!
        </h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <input
              className="bg-cyan-50 p-4 rounded-xl w-full border border-cyan-50 focus:border-cyan-300 outline-none text-cyan-950"
              type="text"
              placeholder="Type name..."
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.username && (
              <div className="text-orange-700">{formik.errors.username}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              className="bg-cyan-50 p-4 rounded-xl w-full border border-cyan-50 focus:border-cyan-300 outline-none text-cyan-950"
              type="text"
              placeholder="Type username..."
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
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
            />
            {formik.errors.password && (
              <div className="text-orange-700">{formik.errors.password}</div>
            )}
          </div>

          <button
            className="bg-cyan-500 p-4 rounded-xl w-full font-semibold text-cyan-50 mt-8 hover:bg-cyan-600 transition-all duration-300 ease-in-out"
            type="submit"
          >
            {loading ? "signing in" : "Signup"}
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
            onClick={handleAlreadyRegistered}
            className="text-slate-300 hover:text-cyan-400"
          >
            Already registered?
          </button>
        </div>

        {error && <div className="text-orange-700">{error}</div>}
      </form>
    </div>
  );
}

export default SignupForm;
