import axios from "axios";

const SIGNUP = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;

export const signupUser = async (values) => {
  try {
    const response = await axios.post(SIGNUP, values);
    return response.data;
  } catch (error) {
    throw error?.response?.data.error.message || "Signup failed";
  }
};
