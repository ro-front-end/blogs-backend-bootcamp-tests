"use client";

import React from "react";

import { createBlogThunk } from "@/slices/blogSlice";
import {
  blogSchema,
  initialValues,
} from "@/validations/createBlogValidation.form";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useAuthHook } from "@/hooks/setAuthHook";
import Image from "next/image";
import { useState } from "react";

export default function CreateBlogForm({
  initialData = null,
  onSubmitCallBack,
  showForm,
  handleCloseForm,
  handleOpenForm,
  isEdit,
}) {
  const [preview, setPreview] = useState(null);

  const { user, token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const authChecked = useAuthHook();

  const formik = useFormik({
    initialValues: initialData || {
      ...initialValues,
      author: user?.username || "",
    },
    validationSchema: blogSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!token) {
        alert("You must be logged in to create a blog.");
        return;
      }

      let imageUrl;

      const file = values.file;

      if (file) {
        try {
          const uploadForm = new FormData();
          uploadForm.append("file", file);

          const uploadRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/upload`,
            uploadForm,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          imageUrl = uploadRes.data.imageUrl;
        } catch (err) {
          console.error("Image upload failed:", err.message);
          alert("Image upload failed.");
          return;
        }
      }

      const blogData = {
        title: values.title,
        author: values.author,
        content: values.content,
        imageUrl: imageUrl || "", // si no hay imagen, campo vacío
      };

      if (isEdit && onSubmitCallBack) {
        await onSubmitCallBack(blogData);
      } else {
        dispatch(createBlogThunk({ token, formData: blogData }));
        resetForm();
      }

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      handleCloseForm();
    },
  });

  if (!authChecked) return null;
  if (!user) return <p>Redirecting to login...</p>;

  return (
    <div className={`relative flex justify-center  w-full mx-auto`}>
      {!showForm && isEdit ? (
        <>
          {isEdit ? (
            <button
              type="button"
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-500 hover:to-cyan-400 transition duration-300"
            >
              Post Blog!
            </button>
          ) : null}
        </>
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className=" mt-4 p-8 bg-gradient-to-br from-slate-900 to-cyan-950 text-white shadow-2xl rounded-2xl z-10 max-w-xl animate-fade-in  "
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Create a New Blog</h3>
            <button
              type="button"
              onClick={() => handleCloseForm()}
              className="text-2xl font-bold text-cyan-200 hover:text-orange-700 transition"
            >
              &times;
            </button>
          </div>

          <input
            className="bg-slate-800 text-white placeholder-cyan-300 p-4 mb-4 rounded-xl w-full border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="Title"
            id="title-input"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-orange-500 text-sm">{formik.errors.title}</div>
          )}

          <input
            className="bg-slate-800 text-white placeholder-cyan-300 p-4 mb-4 rounded-xl w-full border border-cyan-700"
            type="text"
            name="author"
            value={formik.values.author}
            readOnly
            placeholder="Author"
          />

          <textarea
            className="bg-slate-800 text-white placeholder-cyan-300 p-4 mb-4 rounded-xl w-full border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            placeholder="Content"
            rows="6"
          />
          {formik.touched.content && formik.errors.content && (
            <div className="text-orange-500 text-sm">
              {formik.errors.content}
            </div>
          )}

          <div className="relative w-48 h-48 border border-cyan-700 rounded-xl overflow-hidden cursor-pointer bg-slate-800 mb-6">
            <input
              type="file"
              name="file"
              accept="image/*"
              className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                formik.setFieldValue("file", file);

                if (file) {
                  setPreview(URL.createObjectURL(file));
                } else {
                  setPreview(null);
                }
              }}
            />
            {preview ? (
              <div className="relative w-full h-full">
                <Image
                  fill
                  quality={20}
                  src={preview}
                  alt="preview"
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-cyan-300 flex justify-center items-center h-full">
                Click to upload image
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl w-full transition duration-300"
            disabled={loading}
          >
            {isEdit
              ? loading
                ? "Editing..."
                : "Edit Post"
              : loading
              ? "Posting..."
              : "Post Blog"}
          </button>

          {error && <p className="text-orange-500 mt-4">{error}</p>}
        </form>
      )}
    </div>
  );
}
