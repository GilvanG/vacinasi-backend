import * as yup from "yup";
import { daysOfScheduleModel } from "./daysOfSchedulesModel";

export let scheduleModel = yup.array().of(daysOfScheduleModel);
