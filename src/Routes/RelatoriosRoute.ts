import { Router } from "express"
import { RelatoriosController } from "../Controller/RelatoriosController";

const relatorioController = new RelatoriosController()
export const routerRelatorio = Router();

routerRelatorio.get('/relatorio/vendasDiarias', relatorioController.vendasDiarias)
routerRelatorio.get('/relatorio/conversaoDeVendas', relatorioController.conversaoDeVendas)
routerRelatorio.get('/relatorio/carrinhos', relatorioController.carrinhosAbandonados)
routerRelatorio.get('/relatorio/desempenho', relatorioController.desempenhoDeProdutos)

routerRelatorio.post('/relatorio/vendasDiarias/selecionar', relatorioController.vendasDiariasSelecionar)
routerRelatorio.post('/relatorio/conversaoDeVendas/selecionar', relatorioController.conversaoDeVendasSelecionar)
routerRelatorio.post('/relatorio/carrinhos/selecionar', relatorioController.carrinhosAbandonadosSelecionar)
routerRelatorio.post('/realtorio/despesaseganhos/selecionar', relatorioController.despesasEGanhosSelecionar)
