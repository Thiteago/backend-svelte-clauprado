import { Router } from "express"
import { PromocaoController } from "../Controller/PromocaoController";

const promocaoController = new PromocaoController()
export const routerPromocao = Router();


routerPromocao.post("/promocao/cadastrar", promocaoController.cadastrar);

routerPromocao.patch("/promocao/desabilitar/:id", promocaoController.desabilitar);
routerPromocao.patch("/promocao/alterar/:id", promocaoController.alterar)

routerPromocao.delete("/promocao/excluir/:id", promocaoController.excluir)

routerPromocao.get("/promocao/listar", promocaoController.listar);
routerPromocao.get("/promocao/listar/:id", promocaoController.listarPeloId)
routerPromocao.get("/promocao/promocoesativas", promocaoController.listarPromocaoAtiva)




