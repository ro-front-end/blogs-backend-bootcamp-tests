import axios from "axios";

const BLOGS = `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`;

export const getBlogs = async () => {
  const response = await axios.get(`${BLOGS}`);
  return response.data;
};

export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${BLOGS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Couldn't fetch blog", error.message);
    throw error;
  }
};

export const createBlog = async (token, values) => {
  try {
    console.log("Values values:", values);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${BLOGS}`, values, config);
    return response.data;
  } catch (error) {
    console.error("Error creating blog", error.response?.data || error.message);
    throw error;
  }
};

export const updateBlog = async (id, updatedBlog, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${BLOGS}/${id}`, updatedBlog, config);
    return response.data;
  } catch (error) {
    console.error("Couldn't update blog");
    throw error;
  }
};

export const giveLike = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.patch(`${BLOGS}/${id}/likes`, null, config);
    return response.data;
  } catch (error) {
    console.error("Coudn't give like", error.message);
    throw error;
  }
};

export const deleteBlog = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${BLOGS}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Couldn't delete blog", error.message);
    throw error;
  }
};

export const uploadBlogImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(`${BLOGS}/upload`, formData, config);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};
