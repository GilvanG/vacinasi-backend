import { Router } from "express";
import { scheduleRoutes } from "./scheduleRoute.js";

const router = Router();

router.use("/", scheduleRoutes);

export { router };
