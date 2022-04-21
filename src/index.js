import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan("dev"));
app.use(helmet())
app.use(router);

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
