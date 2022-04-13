import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { PatientRepositoryInMemory } from "./repositories/patientRepositories.js";
import { SchedulesRepositoryInMemory } from "./repositories/scheduleRepositories.js";
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
