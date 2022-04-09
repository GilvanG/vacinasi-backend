import * as yup from "yup";

export let pacientModel = yup.object().shape({
  id: yup
    .string("UserId data type is invalid")
    .uuid()
    .required("Userid field is required"),
  name: yup
    .string("Username data type is invalid")
    .required("Username field is required"),
  birthDate: yup
    .date("Birth date data type is invalid")
    .required("Birth date field is required"),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});
