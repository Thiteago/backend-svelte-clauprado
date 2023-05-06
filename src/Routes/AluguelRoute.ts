import {Router} from "express"
import { AluguelController } from "../Controller/AluguelController";

const aluguelcontroller = new AluguelController()
export const routerAluguel = Router();


routerAluguel.get("/aluguel/listar", aluguelcontroller.listar);
