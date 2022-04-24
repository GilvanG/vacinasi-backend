import request from 'supertest';
import { app } from '../index.js';
import { PatientRepositoryInMemory } from '../repositories/patientRepositories.js';
import { SchedulesRepositoryInMemory } from '../repositories/scheduleRepositories.js';

let scheduleRep;
let patientRep;

beforeEach(() => {
  patientRep = new PatientRepositoryInMemory();
  scheduleRep = new SchedulesRepositoryInMemory(patientRep);
});

describe("schedule controller", () => {
  it("should lists shedules", async () => {
    await request(app).get('').expect(200)
  })
  it("should create shedules", async () => {
    await request(app).post('/').send({
      dayHourSchedule: new Date(),
      patientName: "Ana",
      patientBirthDate: new Date("12/12/2001"),
    }).expect(201)
  })
  it("should create shedules", async () => {
    const response = await request(app).post('/').send({
      dayHourSchedule: new Date(),
      patientName: "Ana",
      patientBirthDate: new Date("12/12/2001"),
    })
    expect(response.status).toBe(201);
    expect(response.body.schedule).toHaveProperty("id");
    expect(response.body.schedule).toHaveProperty("day");
    expect(response.body.schedule).toHaveProperty("scheduleForHour");
    expect(response.body.patient).toHaveProperty("id");
    expect(response.body.patient).toHaveProperty("name");
    expect(response.body.patient).toHaveProperty("birthDate");
  })
  it("should find shedules", async () => {
    const responseCreate = await request(app).post('/').send({
      dayHourSchedule: new Date(),
      patientName: "Ana",
      patientBirthDate: new Date("12/12/2001"),
    });
    let id = '/' + responseCreate.body.schedule.id
    const response = await request(app).get(id)

    expect(response.status).toBe(200);
    // expect(response.body.schedule).toHaveProperty("id");
    // expect(response.body.schedule).toHaveProperty("day");
    // expect(response.body.schedule).toHaveProperty("scheduleForHour");
    // expect(response.body.patient).toHaveProperty("id");
    // expect(response.body.patient).toHaveProperty("name");
    // expect(response.body.patient).toHaveProperty("birthDate");
  })
})
