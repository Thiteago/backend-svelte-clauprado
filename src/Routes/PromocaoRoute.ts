import { Router } from "express"
import { PromocaoController } from "../Controller/PromocaoController";

const promocaoController = new PromocaoController()
export const routerPromocao = Router();


routerPromocao.post("/promocao/cadastrar", promocaoController.cadastrar);

routerPromocao.patch("/promocao/desabilitar/:id", promocaoController.desabilitar);

routerPromocao.get("/promocao/listar", promocaoController.listar);
routerPromocao.get("/promocao/promocoesativas", promocaoController.listarPromocaoAtiva)




