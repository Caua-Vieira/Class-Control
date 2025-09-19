import express from "express";
import { classControlRouter } from "./routes/class-control-routes";
import { errorHandler } from "../middleware/error-handler";

const app = express();
app.use(express.json());
app.use(classControlRouter())
app.use(errorHandler);

export default app;
