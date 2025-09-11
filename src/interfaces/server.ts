import express from "express";
import { Container } from "typescript-ioc";
import YAML from 'yamljs';

const app = express();
app.use(express.json());

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(errorHandler);


export default app;
