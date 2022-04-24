import crypto from "crypto";
import { patientModel } from "../models/patientModel.js";

class PatientRepositoryInMemory {
  patients = [];

  async create({ /*id,*/ name, birthDate }) {
    // if (id == null || id == undefined) {
    const id = crypto.randomUUID();
    // }
    const patient = patientModel.validateSync({
      id,
      name,
      birthDate,
    });
    if (patient) {
      this.patients.push(patient);
      return patient;
    }
    throw new Error("Patient is Invalid");
  }

  async findByName(name) {
    return this.patients.find((patient) => patient.name === name);
  }

  findById(id) {
    return this.patients.find((patient) => patient.id === id);
  }

  async list() {
    const patientsList = this.patients.map(({ name, birthDate }) => {
      return { name, birthDate };
    });
    return patientsList;
  }

  async removeById(patientId) {
    const patientIndex = this.patients.findIndex(
      (patient) => patient.id === patientId
    );
    if (patientIndex !== -1) {
      // console.log(this.patients)
      this.patients = (this.patients.splice(patientIndex, patientIndex))
      return this.patients;
    }
    throw new Error("Patient Not Found");
  }

  async updateById(patientId, newValues) {
    let patientIndex = this.patients.findIndex(
      (patient) => patient.id === patientId
    );
    if (patientIndex !== -1) {
      const name = newValues.name || this.patients[patientIndex].name;
      const birthDate =
        newValues.birthDate || this.patients[patientIndex].birthDate;
      const patientIsValid = patientModel.validateSync({
        ...this.patients[patientIndex],
        name,
        birthDate,
      });
      if (patientIsValid) {
        this.patients[patientIndex] = {
          ...this.patients[patientIndex],
          name,
          birthDate,
        };
        return this.patients[patientIndex];
      }
      throw new Error("Patient is Invalid");
    }
    throw new Error("Patient Not Found");
  }
}

export { PatientRepositoryInMemory };
