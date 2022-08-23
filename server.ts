import express from "express"
import cors from "cors"
import { Router } from "express";
import { router } from "./src/Routes/UsuarioRoute";
const app = express();

const corsOptions = {
  Origin: '*',
  methods: ['GET', 'PUT', 'POST'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
app.listen(3333, () => console.log('Server is running on port 3333'));
