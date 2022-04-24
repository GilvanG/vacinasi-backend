import { PatientRepositoryInMemory } from '../repositories/patientRepositories.js';

let patientRep;

beforeEach(() => {
  patientRep = new PatientRepositoryInMemory();
});

describe("create patient", () => {
  it("execute action of create", async () => {
    const birthDate = new Date("12/12/1988");
    const patient = await patientRep.create({ name: "Ana", birthDate })
    expect(patient).toHaveProperty("id");
    expect(patient).toHaveProperty("name");
    expect(new Date(patient.birthDate).getTime()).toBe(new Date(birthDate).getTime());
    expect(patient).toHaveProperty("birthDate");
  })
})

describe("find patient in repository", () => {
  it("execute action of find by Id patient", async () => {
    const birthDate = new Date("12/12/1988");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    const patientFind = await patientRep.findById(patient.id);
    expect(patient.id).toBe(patientFind.id);
    expect(patient.name).toBe(patientFind.name);
    expect(new Date(patient.birthDate).getTime()).toBe(new Date(patientFind.birthDate).getTime());
  })
  it("execute action of find by name patient", async () => {
    const birthDate = new Date("12/12/1988");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    const patientFind = await patientRep.findByName(patient.name);
    expect(patient.id).toBe(patientFind.id);
    expect(patient.name).toBe(patientFind.name);
    expect(new Date(patient.birthDate).getTime()).toBe(new Date(patientFind.birthDate).getTime());
  })
})

describe("update patient in repository", () => {
  it("execute action of update", async () => {
    const birthDate = new Date("12/12/1988");
    const birthDate2 = new Date("12/12/1999");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    const patientUpdated = await patientRep.updateById(patient.id, { name: "Ana Luisa", birthDate: birthDate2 })
    const patientFind = await patientRep.findById(patient.id);
    expect(patientUpdated.id).toBe(patientFind.id);
    expect(patientUpdated.name).toBe(patientFind.name);
    expect(patientUpdated.name).not.toBe(patient.name);
    expect(new Date(patientUpdated.birthDate).getTime()).toBe(new Date(patientFind.birthDate).getTime());
    expect(new Date(patientUpdated.birthDate).getTime()).not.toBe(new Date(patient.birthDate).getTime());
  })
  it("reject action of update, when patient not found", async () => {
    const birthDate = new Date("12/12/1988");
    const birthDate2 = new Date("12/12/1999");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    let patientFake = { ...patient }
    patientFake.id = 'a2259f79-e1f7-4fbd-beaa-4bdd6c6177d1'
    const teste = async () => await patientRep.updateById(patientFake.id, { name: "Ana Luisa", birthDate: birthDate2 })
    try {
      await teste()

    } catch (error) {
      expect(error.message).toBe("Patient Not Found")
    }
  })
})
describe("removed patient in repository", () => {
  it("execute action of removed", async () => {
    const birthDate = new Date("12/12/1988");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    await patientRep.removeById(patient.id)
    const patientFind = await patientRep.findById(patient.id);
    expect(patientFind).toBe(undefined);
  })

  it("reject action of removed status, when patient not found", async () => {
    const birthDate = new Date("12/12/1988");
    const patient = await patientRep.create({ name: "Ana Carla", birthDate })
    let patientFake = { ...patient }
    patientFake.id = 'a2259f79-e1f7-4fbd-beaa-4bdd6c6177d1'
    const teste = async () => await patientRep.removeById(patientFake.id)
    try {
      await teste()

    } catch (error) {
      expect(error.message).toBe("Patient Not Found")
    }
  })
})
