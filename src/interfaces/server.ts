import express from "express";
import { classControlRouter } from "./routes/class-control-routes";

const app = express();
app.use(express.json());
app.use(classControlRouter())

export default app;
