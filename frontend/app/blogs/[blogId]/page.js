"use client";

import { useAuthHook } from "@/hooks/setAuthHook";
import {
  fetchBlogByIdThunk,
  giveLikeThunk,
  updateBlogThunk,
} from "@/slices/blogSlice";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBackward, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function BlogDetailPage() {
  const [isLiking, setIsLiking] = useState(false);
  const params = useParams();

  const router = useRouter();
  const blogId = params.blogId;

  const { selectedBlog, loading, error } = useSelector((state) => state.blogs);
  const { token } = useSelector((state) => state.auth);
  const userId = useSelector((state) => state.auth.userId);

  const userHasLiked =
    selectedBlog && selectedBlog.likedBy
      ? selectedBlog.likedBy?.includes(userId)
      : false;
  const dispatch = useDispatch();

  const authChecked = useAuthHook();

  useEffect(() => {
    dispatch(fetchBlogByIdThunk(blogId));
  }, [dispatch, blogId]);

  const handleGiveLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      await dispatch(
        giveLikeThunk({
          id: selectedBlog.id,
          token,
        })
      ).unwrap();
    } catch (err) {
      console.error("No se pudo dar like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-cyan-300">
        Loading...
      </div>
    );

  if (!selectedBlog)
    return <p className="text-yellow-300 text-center mt-10">No Blog Found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-gray-900  rounded-lg shadow-lg mt-10 text-cyan-50">
      <div className="flex items-start relative w-full h-80 justify-end">
        <Image
          fill
          className="absolute object-cover rounded-t-xl"
          src={selectedBlog.imageUrl || "/ads-future.png"}
          alt={selectedBlog.title}
          quality={30}
        />
        <div
          className="flex gap-2 items-center justify-end cursor-pointer hover:text-orange-600 transition duration-300 bg-black z-10 w-full bg-opacity-60 rounded-t-xl p-2"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="text-xl text-orange-600 z-10 md:text-lg " />
          <p className="z-10 text-xl">Go Back</p>
        </div>
      </div>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 border-b-2 border-cyan-400 pb-2">
          {selectedBlog.title}
        </h1>
        <p className="text-cyan-300 italic mb-6">By {selectedBlog.author}</p>
        <article className="prose prose-cyan prose-lg max-w-none">
          {selectedBlog.content}
        </article>
        <div className="flex justify-end gap-4 mt-6 items-baseline">
          Like this article?:{" "}
          <FaThumbsUp
            id="thumbup"
            onClick={!userHasLiked && !isLiking ? handleGiveLike : null}
            className={`transition duration-300 cursor-pointer ${
              userHasLiked
                ? "text-gray-400 cursor-not-allowed"
                : "hover:text-cyan-400 cursor-pointer"
            }`}
          />{" "}
          <span id="likes-count">{selectedBlog.likes}</span>
        </div>
        {error && (
          <div className="text-red-400 bg-red-900 p-4 rounded-md max-w-lg mx-auto mt-10">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetailPage;
