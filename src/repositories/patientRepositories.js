import crypto from "crypto";
import { patientModel } from "../models/patientModel.js";

class PatientRepositoryInMemory {
  patients = [];

  async create({ id, name, birthDate }) {
    try {
      if (id == null || id == undefined) {
        id = crypto.randomUUID();
      }
      const patient = patientModel.validateSync({
        id,
        name,
        birthDate,
      });
      if (patient) {
        this.patients.push(patient);
        return patient;
      }
      return patient;
    } catch (error) {
      return error.message;
    }
  }

  async findByName(name) {
    return this.patients.find((patient) => patient.name === name);
  }

  async findById(id) {
    return this.patients.find((patient) => patient.id === id);
  }

  async list() {
    const patientsList = this.patients.map(({ name, birthDate }) => {
      return { name, birthDate };
    });
    return patientsList;
  }
}

export { PatientRepositoryInMemory };
