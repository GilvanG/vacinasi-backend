import { PatientRepositoryInMemory } from '../repositories/patientRepositories.js';
import { SchedulesRepositoryInMemory } from '../repositories/scheduleRepositories.js';

let scheduleRep;
let patientRep;

beforeEach(() => {
  patientRep = new PatientRepositoryInMemory();
  scheduleRep = new SchedulesRepositoryInMemory(patientRep);
});

describe("create day for schedule in repository", () => {
  it("execute action of create day schedule", async () => {
    let day = new Date();
    day.setMilliseconds(0);
    day.setSeconds(0);
    day.setMinutes(0);
    day.setHours(0);
    const schedule = await scheduleRep.createSchedule({ daySchedule: day })
    expect(schedule).toHaveProperty("id");
    expect(schedule).toHaveProperty("day");
    expect(new Date(schedule.day).getTime()).toBe(new Date(day).getTime());
    expect(schedule).toHaveProperty("scheduleForHour");
  })
  it("execute action of create hour schedule", async () => {
    let dayHour = new Date();
    let day = dayHour;
    day.setMilliseconds(0);
    day.setSeconds(0);
    day.setMinutes(0);
    day.setHours(0);
    const scheduleDay = await scheduleRep.createSchedule({ daySchedule: dayHour })
    const patient = await patientRep.create({ name: "Ana", birthDate: new Date(190) })
    const schedule = await scheduleRep.newHourOfSchedule(
      {
        scheduleId: scheduleDay.id,
        hourSchedule: dayHour,
        patientId: patient.id
      }
    )
    expect(schedule).toHaveProperty("id");
    expect(schedule).toHaveProperty("day");
    expect(schedule).toHaveProperty("scheduleForHour");
    expect(schedule.scheduleForHour[0]).toHaveProperty("hour");
    expect(schedule.scheduleForHour[0]).toHaveProperty("patients");
    expect(schedule.scheduleForHour[0].patients[0]).toHaveProperty("id");
    expect(schedule.scheduleForHour[0].patients[0]).toHaveProperty("note");
    expect(schedule.scheduleForHour[0].patients[0]).toHaveProperty("status");
    expect(new Date(schedule.day).getTime()).toBe(new Date(day).getTime());
    expect(schedule.scheduleForHour[0].patients[0].id).toBe(patient.id);
    expect(schedule.scheduleForHour[0].hour).toBe(dayHour);
  })
})

describe("find schedule in repository", () => {
  it("execute action of find by Id schedule", async () => {
    let day = new Date();
    const scheduleOrigin = await scheduleRep.createSchedule({ daySchedule: day })
    const scheduleFind = await scheduleRep.findById(scheduleOrigin.id);
    expect(scheduleOrigin.id).toBe(scheduleFind.id);
    expect(scheduleOrigin.scheduleForHour).toBe(scheduleFind.scheduleForHour);
    expect(new Date(scheduleOrigin.day).getTime()).toBe(new Date(scheduleFind.day).getTime());
  })
  it("execute action of find by hour schedule", async () => {
    let dayHour = new Date();
    dayHour.setMilliseconds(0);
    dayHour.setSeconds(0);
    dayHour.setMinutes(0);
    const scheduleDayOrigin = await scheduleRep.createSchedule({ daySchedule: dayHour })
    const patient = await patientRep.create({ name: "Ana", birthDate: new Date(190) })
    const schedule = await scheduleRep.newHourOfSchedule(
      {
        scheduleId: scheduleDayOrigin.id,
        hourSchedule: dayHour,
        patientId: patient.id
      }
    )
    const scheduleFind = await scheduleRep.findByHour(dayHour);
    expect(schedule.scheduleForHour[0].patients[0].id).toBe(scheduleFind.patients[0].id);
    expect(new Date(schedule.scheduleForHour[0].hour).getTime()).toBe(new Date(scheduleFind.hour).getTime());
  })
})

describe("update status schedule in repository", () => {
  it("execute action of update status", async () => {
    let dayHour = new Date();
    dayHour.setMilliseconds(0);
    dayHour.setSeconds(0);
    dayHour.setMinutes(0);
    const scheduleDay = await scheduleRep.createSchedule({ daySchedule: dayHour })
    const patient = await patientRep.create({ name: "Ana", birthDate: new Date(190) })
    await scheduleRep.newHourOfSchedule(
      {
        scheduleId: scheduleDay.id,
        hourSchedule: dayHour,
        patientId: patient.id
      }
    )
    const scheduleUpdated = await scheduleRep.updateStatusSchedule({
      scheduleId: scheduleDay.id,
      hourSchedule: dayHour,
      patientId: patient.id,
      newValues: { status: "completed", note: "ok" }
    })
    const scheduleFind = await scheduleRep.findById(scheduleDay.id);
    expect(scheduleUpdated.id).toBe(scheduleFind.id);
    expect(scheduleUpdated.scheduleForHour[0].patients[0].id).toBe(scheduleFind.scheduleForHour[0].patients[0].id);
    expect(scheduleUpdated.scheduleForHour[0].patients[0].note).toBe("ok");
    expect(scheduleUpdated.scheduleForHour[0].patients[0].status).toBe("completed");
    expect(scheduleUpdated.scheduleForHour[0].patients[0].note).toBe(scheduleFind.scheduleForHour[0].patients[0].note);
    expect(scheduleUpdated.scheduleForHour[0].patients[0].status).toBe(scheduleFind.scheduleForHour[0].patients[0].status);
    expect(new Date(scheduleUpdated.scheduleForHour[0].patients[0].hour).getTime()).toBe(new Date(scheduleFind.scheduleForHour[0].patients[0].hour).getTime());
  })
  it("reject action of update status, when status invalid", async () => {
    let dayHour = new Date();
    dayHour.setMilliseconds(0);
    dayHour.setSeconds(0);
    dayHour.setMinutes(0);
    const scheduleDay = await scheduleRep.createSchedule({ daySchedule: dayHour })
    const patient = await patientRep.create({ name: "Ana", birthDate: new Date(190) })
    await scheduleRep.newHourOfSchedule(
      {
        scheduleId: scheduleDay.id,
        hourSchedule: dayHour,
        patientId: patient.id
      }
    )
    const teste = async () => await scheduleRep.updateStatusSchedule({
      scheduleId: scheduleDay.id,
      hourSchedule: dayHour,
      patientId: patient.id,
      newValues: { status: "competed", note: "ok" }
    })
    try {
      await teste()

    } catch (error) {
      expect(error.message).toBe("scheduleForHour[0].patients[0].status must be one of the following values: completed, cancelled, unfulfilled, other")
    }
  })
})
