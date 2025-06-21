"use client";

import React from "react";

import { fetchBlogsThunk } from "@/slices/blogSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

function BlogList() {
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const [blogFilter, setBlogFilter] = useState("recent");
  const dispatch = useDispatch();
  console.log(blogs);

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogsThunk());
    }
  }, [blogs.length, dispatch]);

  const sortedBlogs = [...blogs].sort((a, b) => {
    if (blogFilter === "trending") {
      return b.likes - a.likes;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading blogs: {error}
      </p>
    );

  return (
    <>
      <div className="p-4 border-b border-cyan-800 bg-black bg-opacity-40 rounded-t-2xl mt-4 flex items-baseline justify-between sm:justify-start sm:gap-8">
        <div className="space-x-2 sm:space-x-4 text-sm">
          <label htmlFor="">Filter by</label>
          <select
            className="p-2 border-[.1rem] border-cyan-800 outline-none hover:border-cyan-500 bg-black bg-opacity-50 rounded-xl mt-4 cursor-pointer hover:bg-slate-800"
            value={blogFilter}
            onChange={(e) => setBlogFilter(e.target.value)}
          >
            <option className="" value="recent">
              Recent
            </option>
            <option value="trending">Trending</option>
          </select>
        </div>
        <p className="text-cyan-400 font-semibold text-xl">
          {blogFilter === "recent" ? "Recent" : "Trending"}
        </p>
      </div>
      <div
        className="grid grid-cols-1 justify-center sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6 mt-4
    "
      >
        {sortedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gradient-to-br from-slate-900 to-cyan-900 text-white rounded-2xl shadow-lg flex flex-col justify-between w-full mx-auto"
          >
            <div className="relative w-full h-[10rem] sm:h-52 ">
              <Image
                fill
                className="absolute object-cover rounded-t-xl"
                src={blog.imageUrl || "/ads-future.png"}
                alt={blog.title}
                quality={20}
              />
            </div>
            <div className="p-4 border-b border-cyan-800 bg-black bg-opacity-50 rounded-t-2xl">
              <h2 className="text-xl font-bold truncate">{blog.title}</h2>
              <p className="text-sm text-cyan-300">By: {blog.author}</p>
            </div>
            <div className="p-4 flex-1 overflow-auto text-sm">
              {blog.content.slice(0, 150)}...
              <div className="flex justify-end items-end">
                <Link
                  className="text-cyan-200 hover:text-cyan-300"
                  href={`blogs/${blog.id}`}
                >
                  <br /> See more...
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BlogList;
