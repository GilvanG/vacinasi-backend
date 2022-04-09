import * as yup from "yup";
import moment from "moment";

export let daysOfScheduleModel = yup.object().shape({
  id: yup
    .string("Id data type is invalid")
    .uuid()
    .required("Id field is required"),
  schedule: yup
    .date("Schedule data type is invalid")
    .required("Schedule field is required"),
  hourOfSchedule: yup
    .array()
    .max(20)
    .test("20SchedulesForDay", "Limit schedules for day is 20", function () {
      const countHourOfSchedule = this.parent.hourOfSchedule.reduce(
        (previus, currentValue) => {
          return previus + currentValue.pacients.length;
        },
        0
      );
      return countHourOfSchedule <= 20;
    })
    .of(
      yup.object().shape({
        hour: yup
          .string()
          .test(
            "isValidHour",
            "Hour don't type date or not happen in date from schedule described",
            function (value, context) {
              const hourConvertInDate = new Date(value);
              const { schedule } = context.options.from[1].value;
              // console.log(schedule);
              return (
                !(String(hourConvertInDate) === "Invalid Date") &&
                moment(hourConvertInDate).isSameOrAfter(schedule)
              );
            }
          ),
        pacients: yup
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
