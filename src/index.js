import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
