import axios from "axios";

const LOGIN = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;

export const loginUser = async (values) => {
  try {
    const response = await axios.post(`${LOGIN}`, values);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
