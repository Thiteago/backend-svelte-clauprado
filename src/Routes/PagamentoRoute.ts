import { Router } from "express"
import { VendaController } from "../Controller/VendaController";



const vendaController = new VendaController()
export const routerVenda = Router();


routerVenda.post("/venda/gerar", vendaController.gerar);







