import { useEffect, useState } from "react";
import CreateBlogForm from "./createBlogForm";
import { useDispatch, useSelector } from "react-redux";
import { userByIdThunk } from "@/slices/user.slice";
import {
  deleteBlogThunk,
  fetchBlogByIdThunk,
  updateBlogThunk,
} from "@/slices/blogSlice";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Link from "next/link";

function BlogTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const [editBlog, setEditBlog] = useState(null);
  const dispatch = useDispatch();

  const loggedById = useSelector((state) => state.auth.user?.id);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);

  const [localBlogs, setLocalBlogs] = useState(user?.blogs || []);

  useEffect(() => {
    setLocalBlogs(user?.blogs || []);
  }, [user?.blogs]);

  useEffect(() => {
    if (loggedById && user?.id !== loggedById) {
      dispatch(userByIdThunk(loggedById));
    }
  }, [dispatch, loggedById, user?.id]);

  const handleDeleteBlog = (id) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlogThunk({ id, token })).then(() => {
        dispatch(userByIdThunk(loggedById));
      });
    }
  };

  const handleUpdateBlog = async (formData) => {
    console.log("Update blog:", formData);
    if (!editBlog || !token) return;

    const result = await dispatch(
      updateBlogThunk({ id: editBlog.id, token, formData })
    );
    const updatedBlog = result.payload;
    dispatch(userByIdThunk(loggedById));

    if (updatedBlog) {
      setLocalBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      );
    }
    setEditBlog(null);
    setTabIndex(0);
  };

  const handleEditClick = (blog) => {
    setEditBlog(blog);
    setTabIndex(1);
  };

  const handleCloseForm = () => {
    setEditBlog(null);
    setTabIndex(0);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="inline-flex bg-slate-900 rounded-full p-1 shadow-md border border-slate-800">
        <button
          onClick={() => {
            setTabIndex(0);
            setEditBlog(null);
          }}
          className={`px-6 py-2 rounded-full font-semibold text-sm ${
            tabIndex === 0
              ? "bg-cyan-600 text-white shadow-inner"
              : "text-cyan-300 hover:bg-slate-800"
          }`}
        >
          My Blogs
        </button>
        <button
          onClick={() => {
            setTabIndex(1);
            setEditBlog(null);
          }}
          className={`px-6 py-2 rounded-full font-semibold text-sm ${
            tabIndex === 1
              ? "bg-cyan-600 text-white shadow-inner"
              : "text-cyan-300 hover:bg-slate-800"
          }`}
        >
          {editBlog ? "Edit Blog" : "Create Blog"}
        </button>
      </div>
      {tabIndex === 0 && (
        <div className="text-cyan-300 w-full max-w-5xl p-6">
          {localBlogs.length === 0 ? (
            <p>No blogs yet</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {localBlogs.map((blog) => (
                <li
                  className="bg-gradient-to-br from-slate-900 to-cyan-900 text-white rounded-2xl shadow-lg flex flex-col"
                  key={blog.id}
                >
                  <div className="p-4 border-b border-cyan-800 bg-black bg-opacity-50 rounded-t-2xl">
                    <h2 className="text-xl font-bold truncate">{blog.title}</h2>
                    <p className="text-sm text-cyan-300">By: {blog.author}</p>
                  </div>

                  <div className="p-4 flex flex-col gap-4 justify-between items-center">
                    <Link
                      className="text-xs text-cyan-50 hover:text-cyan-400"
                      href={`/blogs/${blog.id}`}
                    >
                      Visit Blog
                    </Link>
                    <div className="flex justify-center items-center gap-4">
                      <button
                        id="edit-button"
                        onClick={() => handleEditClick(blog)}
                        className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-4 py-2 rounded-xl transition duration-300"
                        type="button"
                      >
                        <FaPencilAlt />
                      </button>

                      <button
                        id="delete-button"
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-4 py-2 rounded-xl transition duration-300"
                        type="button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tabIndex === 1 && (
        <div className="w-full max-w-lg p-6">
          <CreateBlogForm
            handleCloseForm={handleCloseForm}
            initialData={
              editBlog && {
                title: editBlog.title,
                content: editBlog.content,
                author: editBlog.author,
                file: null,
              }
            }
            onSubmitCallBack={handleUpdateBlog}
            showForm={true}
            isEdit={!!editBlog}
            handleOpenForm={() => {}}
          />
        </div>
      )}
    </div>
  );
}

export default BlogTabs;
