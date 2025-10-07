import express from "express";
import { smartTasksManagement } from "./routes/routes";
import { errorHandler } from "../middleware/error-handler";

const app = express();
app.use(express.json());
app.use(smartTasksManagement())
app.use(errorHandler);

export default app;
