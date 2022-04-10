import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { PatientRepositoryInMemory } from "./repositories/patientRepositories.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
  // const rep = new PatientRepositoryInMemory();
  // rep.create({ name: "John", birthDate: new Date() });
  // rep.create({ name: "Johh", birthDate: new Date() });
  // rep.create({ name: "Johh2", birthDate: new Date() });
  // rep.create({ name: "Johh3", birthDate: new Date() });
  // rep.create({ name: "Johh4", birthDate: new Date() });
  // console.log(rep.list("Johh8"));
});
