import * as yup from "yup";

export let scheduleModel = yup.object().shape({
  id: yup
    .string("Id data type is invalid")
    .uuid()
    .required("Id field is required"),
  day: yup.date("Day data type is invalid").required("Day field is required"),
  scheduleForHour: yup
    .array()
    .max(20)
    .test(
      "20SchedulesForDay",
      "Limit schedules for day is 20",
      function (value, context) {
        if (this.parent.scheduleForHour === []) {
          return true;
        }
        const countHourOfSchedule = this.parent?.scheduleForHour?.reduce(
          (previus, currentValue) => {
            return previus + currentValue.patients?.length;
          },
          0
        );
        return countHourOfSchedule <= 20;
      }
    )
    .of(
      yup.object().shape({
        hour: yup
          .string()
          .test(
            "isValidHour",
            "Hour don't type date or not happen in date from schedule described",
            function (value, context) {
              const hourConvertInDate = new Date(value);
              return !(String(hourConvertInDate) === "Invalid Date");
            }
          ),
        patients: yup
          .array()
          .max(2)
          .of(
            yup.object().shape({
              id: yup.string().uuid(),
              status: yup
                .mixed()
                .oneOf(["completed", "cancelled", "unfulfilled", "other"])
                .required(),
              note: yup.string(),
            })
          ),
      })
    ),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});
