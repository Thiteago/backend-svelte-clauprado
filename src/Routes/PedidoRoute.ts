import { Router } from "express"
import { PedidoController } from "../Controller/PedidoController";



const pedidoController = new PedidoController()
export const routerPedido = Router();


routerPedido.post("/pedido/gerar", pedidoController.gerar);
routerPedido.get("/pedido/listar/user/:id", pedidoController.listarPeloUserId);
routerPedido.get("/pedido/listar/:id", pedidoController.listarPeloId);
routerPedido.get("/pedido/listar/", pedidoController.listarTodos);
routerPedido.delete("/pedido/cancelar/:id", pedidoController.cancelarPedido);
routerPedido.patch("/pedido/alterar/produtos/", pedidoController.alterarProdutos);
routerPedido.patch("/pedido/alterar/endereco/:id", pedidoController.alterarEndereco);
routerPedido.patch("/pedido/informarenvio/:id", pedidoController.marcarComoEnviado);
routerPedido.post("/pedido/capturar/", pedidoController.capturarPagamento);