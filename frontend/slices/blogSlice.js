import {
  createBlog,
  getBlogById,
  getBlogs,
  deleteBlog as deleteBlogService,
  updateBlog,
  giveLike as giveLikeService,
} from "@/services/blogServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

export const fetchBlogsThunk = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const blogs = await getBlogs();
      return blogs;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);

export const fetchBlogByIdThunk = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const blog = await getBlogById(`${id}`);
      return blog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Couldn't fetch blog"
      );
    }
  }
);

export const createBlogThunk = createAsyncThunk(
  "blogs/createBlog",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const newBlog = await createBlog(token, formData);
      return newBlog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create blog"
      );
    }
  }
);

export const updateBlogThunk = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const blogUpdated = await updateBlog(id, formData, token);
      return blogUpdated;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Couldn't update blog"
      );
    }
  }
);

export const giveLikeThunk = createAsyncThunk(
  "blogs/giveLike",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const updatedBlog = await giveLikeService(id, token);
      return updatedBlog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Couldn't give like"
      );
    }
  }
);

export const deleteBlogThunk = createAsyncThunk(
  "blogs/deleteBlog",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await deleteBlogService(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete blog"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
        state.error = null;
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload;

        const index = state.blogs.findIndex(
          (blog) => blog.id === updatedBlog.id
        );
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }

        if (state.selectedBlog && state.selectedBlog.id === updatedBlog.id) {
          state.selectedBlog = updatedBlog;
        }
        state.error = null;
      })
      .addCase(updateBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(giveLikeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(giveLikeThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload;

        const index = state.blogs.findIndex(
          (blog) => blog.id === updatedBlog.id
        );
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }

        if (state.selectedBlog && state.selectedBlog.id === updatedBlog.id) {
          state.selectedBlog = updatedBlog;
        }
        state.error = null;
      })
      .addCase(giveLikeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = blogSlice.actions;

export default blogSlice.reducer;
