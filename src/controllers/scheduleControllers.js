import crypto from "crypto";
import { scheduleModel } from "../models/scheduleModel.js";

class ScheduleController {
  patientRepository = [];
  schedulesRepository = [];
  constructor(PatientRepository, SchedulesRepository) {
    this.patientRepository = PatientRepository;
    this.schedulesRepository = SchedulesRepository;
  }

  async index(_request, response) {
    try {
      const schedules = await this.schedulesRepository.list();
      return response.status(200).json(schedules);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async store(request, response) {
    try {
      const {
        scheduleId,
        dayHourSchedule,
        patientId,
        patientName,
        patientBirthDate,
      } = request.body;

      let schedule = await this.schedulesRepository.createSchedule({
        id: scheduleId,
        daySchedule: dayHourSchedule,
      });
      const patient = await this.patientRepository.create({
        id: patientId,
        name: patientName,
        birthDate: patientBirthDate,
      });
      schedule = await this.schedulesRepository.newHourOfSchedule({
        scheduleId: schedule.id,
        hourSchedule: dayHourSchedule,
        patientId: patient.id,
      });
      if (!patient && !schedule) {
        throw new Error("Unable to generate patient or schedule.");
      }
      return response.status(201).json({ schedule, patient });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      const { scheduleId, hourSchedule, patientId, status, note } =
        request.body;

      const schedule = await this.schedulesRepository.updateStatusSchedule({
        scheduleId,
        hourSchedule,
        patientId,
        newValues: { status, note },
      });
      if (!schedule) {
        throw new Error("Unable to update patient or schedule.");
      }
      return response.json(schedule);
    } catch (error) {
      return response.status(400).json({ error });
    }
  }

  async getOneByHour(request, response) {
    try {
      const { hour } = request.params;
      const schedule = await this.schedulesRepository.findByHour(hour);
      console.log(schedule);

      if (!schedule) {
        return response.status(404).json({ message: "Schedule not found" });
      }
      return response.status(200).json({ schedule });
    } catch (error) {
      response.status(400).send(error);
    }
  }

  async getOneById(request, response) {
    try {
      const { id } = request.params;
      const schedule = await this.schedulesRepository.findById(id);

      if (schedule) {
        return response.json({ schedule });
      }

      response.status(404).json({ message: "Schedule not found" });
    } catch (error) {
      response.status(400).send(error);
    }
  }
}

export default ScheduleController;
