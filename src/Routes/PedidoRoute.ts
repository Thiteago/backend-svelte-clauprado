import { Router } from "express"
import { PedidoController } from "../Controller/PedidoController";



const pedidoController = new PedidoController()
export const routerPedido = Router();


routerPedido.post("/pedido/gerar", pedidoController.gerar);
routerPedido.get("/pedido/listar/:id", pedidoController.listarPeloId);
routerPedido.get("/pedido/listar/", pedidoController.listarTodos);