import * as yup from "yup";

export const initialValues = {
  name: "",
  username: "",
  password: "",
};

export const signupSchema = yup.object({
  name: yup.string().required(),
  username: yup.string().required(),
  password: yup.string().required(),
});
