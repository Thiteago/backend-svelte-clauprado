import { Router } from "express"
import { DespesasController } from "../Controller/DespesasController";

const despesasController = new DespesasController()
export const routerDespesas = Router();


routerDespesas.post("/despesas/cadastrar", despesasController.cadastrar);
routerDespesas.get('/despesas/listar', despesasController.listar)
routerDespesas.patch('/despesas/editar/:id', despesasController.editar)
routerDespesas.delete('/despesas/deletar', despesasController.deletar)





