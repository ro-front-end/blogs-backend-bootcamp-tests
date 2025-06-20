import axios from "axios";

const USER = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${USER}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user", error.message);
    throw error?.response?.data.error || "Failed to fetch user";
  }
};
