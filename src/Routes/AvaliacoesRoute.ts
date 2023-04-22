import { Router } from "express"
import { AvaliacoesController } from "../Controller/AvaliacoesController";

const avaliacoesController = new AvaliacoesController()
export const routerAvaliacoes = Router();


routerAvaliacoes.post("/avaliacoes/produto/cadastrar/:id", avaliacoesController.cadastrar);
routerAvaliacoes.post("/avaliacoes/verificar", avaliacoesController.verificarUsuario);
routerAvaliacoes.get('/avaliacoes/listar/:id', avaliacoesController.listar)
routerAvaliacoes.patch('/despesas/editar/:id', avaliacoesController.editar)
routerAvaliacoes.delete('/despesas/deletar', avaliacoesController.deletar)





