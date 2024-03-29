import crypto from "crypto";
import moment from "moment";

import { scheduleModel } from "../models/scheduleModel.js";

class SchedulesRepositoryInMemory {
  patientRepository = [];
  constructor(PatientRepository) {
    this.patientRepository = PatientRepository;
  }
  schedules = [];

  async createSchedule({ /*id,*/ daySchedule }) {
    // if (id == null || id == undefined) {
    const id = crypto.randomUUID();
    // }
    let day = new Date(daySchedule);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    day.setHours(0);
    let schedule = this.schedules.find(
      (schedule) => String(schedule.day) === String(day)
    );
    if (!schedule) {
      schedule = {
        id,
        day,
        scheduleForHour: [],
      };
      const scheduleIsValid = scheduleModel.validateSync({
        ...schedule,
      });

      this.schedules.push(scheduleIsValid);
    }

    return schedule;
  }

  async newHourOfSchedule({ scheduleId, hourSchedule, patientId }) {
    const patient = this.patientRepository.patients.find(
      (patient) => patient.id === patientId
    );
    if (!patient) {
      throw new Error("Patient not found");
    }

    let schedule = this.schedules.find(
      (schedule) => schedule.id === scheduleId
    );
    if (!schedule) {
      throw new Error("Day schedule not found");
    } else if (schedule.scheduleForHour.length >= 20) {
      throw new Error("Day schedule limit");
    }

    let scheduleHourIndex = schedule.scheduleForHour.findIndex((element) => {
      return String(element.hour) === String(hourSchedule);
    });
    if (scheduleHourIndex === -1) {
      schedule.scheduleForHour.push({
        hour: hourSchedule,
        patients: [{ id: patientId, status: "unfulfilled", note: "" }],
      });
    } else {
      if (schedule.scheduleForHour[scheduleHourIndex].patients.length >= 2) {
        throw new Error("Limit of calls per time reached");
      }
      schedule.scheduleForHour[scheduleHourIndex].patients.push({
        id: patientId,
        status: "unfulfilled",
        note: "",
      });
    }

    if (!moment(schedule.day).isSameOrBefore(hourSchedule)) {
      throw new Error("Hour not happen in date from schedule described");
    }
    const scheduleIsValid = scheduleModel.validateSync({
      ...schedule,
    });

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].id === scheduleIsValid.id) {
        this.schedules[i] = scheduleIsValid;
        return schedule;
      }
    }
    this.schedules.push(scheduleIsValid);
    return schedule;
  }

  async findById(id) {
    return this.schedules.find((schedule) => schedule.id === id);
  }

  async findByHour(hour) {
    let day = new Date(hour);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    day.setHours(0);
    let schedule = this.schedules.find((schedule) => {
      return String(schedule.day) === String(day);
    });
    if (!schedule) {
      return schedule;
    }
    let scheduleHour = schedule.scheduleForHour.find(
      (element) => String(element.hour) === String(hour)
    );
    return scheduleHour;
  }

  async list() {
    const schedulesList = this.schedules.map(({ createdOn, scheduleForHour, ...rest }) => {
      return {
        ...rest,
        scheduleForHour: scheduleForHour.map(
          ({ patients, ...rest }) => {
            return {
              ...rest,
              patients: patients.map(({ id, ...rest }) => {
                return {
                  id,
                  ...rest,
                  ...this.patientRepository.findById(id)
                };
              })
            }
          }
        ),
      };
    });
    return schedulesList;
  }

  async updateStatusSchedule({
    scheduleId,
    hourSchedule,
    patientId,
    newValues,
  }) {
    let scheduleIndex = this.schedules.findIndex(
      (schedule) => schedule.id === scheduleId
    );
    if (scheduleIndex < 0) {
      throw new Error("Schedule not found");
    }
    for (
      let i = 0;
      i < this.schedules[scheduleIndex].scheduleForHour.length;
      i++
    ) {
      if (
        String(this.schedules[scheduleIndex].scheduleForHour[i].hour) ===
        String(hourSchedule) &&
        this.schedules[scheduleIndex].scheduleForHour[i].patients[0].id ===
        patientId
      ) {
        let schedule = { ...this.schedules[scheduleIndex] };
        schedule.scheduleForHour[i].patients[0].status =
          newValues.status || schedule.scheduleForHour[i].patients[0].status;
        schedule.scheduleForHour[i].patients[0].note =
          newValues.note || schedule.scheduleForHour[i].patients[0].note;
        const scheduleIsValid = scheduleModel.validateSync({
          ...schedule,
        });
        if (scheduleIsValid) {
          this.schedules[scheduleIndex].scheduleForHour[i].patients[0].status =
            newValues.status || schedule.scheduleForHour[i].patients[0].status;
          this.schedules[scheduleIndex].scheduleForHour[i].patients[0].note =
            newValues.note || schedule.scheduleForHour[i].patients[0].note;
          return schedule;
        }
      }
      if (
        String(this.schedules[scheduleIndex].scheduleForHour[i].hour) ===
        String(hourSchedule) &&
        this.schedules[scheduleIndex].scheduleForHour[i].patients[1].id ===
        patientId
      ) {
        let schedule = { ...this.schedules[scheduleIndex] };
        schedule.scheduleForHour[i].patients[1].status =
          newValues.status || schedule.scheduleForHour[i].patients[1].status;
        schedule.scheduleForHour[i].patients[1].note =
          newValues.note || schedule.scheduleForHour[i].patients[1].note;
        const scheduleIsValid = scheduleModel.validateSync({
          ...schedule,
        });
        if (scheduleIsValid) {
          this.schedules[scheduleIndex].scheduleForHour[i].patients[1].status =
            newValues.status || schedule.scheduleForHour[i].patients[1].status;
          this.schedules[scheduleIndex].scheduleForHour[i].patients[1].note =
            newValues.note || schedule.scheduleForHour[i].patients[1].note;
          return schedule;
        }
      }
    }
  }
}

export { SchedulesRepositoryInMemory };
