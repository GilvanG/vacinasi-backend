import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { router } from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
