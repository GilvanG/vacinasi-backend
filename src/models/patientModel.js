import * as yup from "yup";

export let patientModel = yup.object().shape({
  id: yup
    .string("Id data type is invalid")
    .uuid("Id is not uuid")
    .required("Id field is required"),
  name: yup
    .string("Name data type is invalid")
    .required("Name field is required"),
  birthDate: yup
    .date("Birth date data type is invalid")
    .required("Birth date field is required"),
  createdOn: yup.date("createdOn data type is invalid").default(function () {
    return new Date();
  }),
});
