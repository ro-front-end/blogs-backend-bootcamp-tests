import * as yup from "yup";

export const initialValues = {
  title: "",
  author: "",
  content: "",
  file: null,
};

export const blogSchema = yup.object({
  title: yup.string().required(),
  author: yup.string().required(),
  content: yup.string().required(),
  file: yup
    .mixed()
    .nullable()
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    }),
});
