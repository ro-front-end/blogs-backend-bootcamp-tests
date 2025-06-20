import * as yup from "yup";

export const initialValues = {
  username: "",
  password: "",
};

export const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});
