import { Router } from "express"
import { PedidoController } from "../Controller/PedidoController";



const pedidoController = new PedidoController()
export const routerPedido = Router();


routerPedido.post("/pedido/gerar", pedidoController.gerar);
routerPedido.get("/pedido/listar/:id", pedidoController.listarPeloId);
routerPedido.get("/pedido/listar/", pedidoController.listarTodos);
routerPedido.patch("/pedido/alterar/produtos/:id", pedidoController.alterarProdutos);
routerPedido.patch("/pedido/alterar/endereco/:id", pedidoController.alterarEndereco);