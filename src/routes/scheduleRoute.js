import { Router } from "express";
import ScheduleController from "../controllers/scheduleControllers.js";
import { SchedulesRepositoryInMemory } from "../repositories/scheduleRepositories.js";
import { PatientRepositoryInMemory } from "../repositories/patientRepositories.js";
const scheduleRoutes = Router();

const repP = new PatientRepositoryInMemory();
const repS = new SchedulesRepositoryInMemory(repP);
const scheduleController = new ScheduleController(repP, repS);

scheduleRoutes.get("/", scheduleController.index.bind(scheduleController));
scheduleRoutes.get(
  "/:id",
  scheduleController.getOneById.bind(scheduleController)
);
scheduleRoutes.get(
  "/hour/:hour",
  scheduleController.getOneByHour.bind(scheduleController)
);
scheduleRoutes.post("/", scheduleController.store.bind(scheduleController));
scheduleRoutes.patch("/", scheduleController.update.bind(scheduleController));

export { scheduleRoutes };
