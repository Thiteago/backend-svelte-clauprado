import { Router } from "express"
import { PagamentoController } from "../Controller/PagamentoController";



const pagamentoController = new PagamentoController()
export const routerPagamento = Router();


routerPagamento.get("/pagamento/boleto/:valor", pagamentoController.geraBoleto);







