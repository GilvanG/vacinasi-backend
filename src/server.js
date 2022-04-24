import dotenv from "dotenv";
import { app } from "./index.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
