import { Router } from "express"
import { PedidoController } from "../Controller/PedidoController";



const pedidoController = new PedidoController()
export const routerPedido = Router();


routerPedido.delete("/pedido/cancelar/:id", pedidoController.cancelarPedido);

routerPedido.post("/pedido/capturar/", pedidoController.capturarPagamento);
routerPedido.post("/pedido/gerar", pedidoController.gerar);

routerPedido.get("/pedido/listar/user/:id", pedidoController.listarPeloUserId);
routerPedido.get("/pedido/listar/:id", pedidoController.listarPeloId);
routerPedido.get("/pedido/listar/", pedidoController.listarTodos);
routerPedido.get("/pedido/listar/alugueis/pendentes", pedidoController.listarAlugueis);

routerPedido.patch("/pedido/alterar/produtos/:id", pedidoController.alterarProdutos);
routerPedido.patch("/pedido/alterar/endereco/:id", pedidoController.alterarEndereco);
routerPedido.patch("/pedido/alterar/envio/:id", pedidoController.atualizarEnvio);
routerPedido.patch("/pedido/alterar/devolucao/:id", pedidoController.atualizarDevolucao);
routerPedido.patch("/pedido/paypal/novamente", pedidoController.pagamentoPedidoGerado);


