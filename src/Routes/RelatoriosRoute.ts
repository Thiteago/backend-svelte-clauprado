import { Router } from "express"
import { RelatoriosController } from "../Controller/RelatoriosController";

const relatorioController = new RelatoriosController()
export const routerRelatorio = Router();

routerRelatorio.get('/relatorio/vendasDiarias', relatorioController.vendasDiarias)