import {Router} from "express"
import { CategoriaController } from "../Controller/CategoriaController";

const categoriacontroller = new CategoriaController()
export const routerCategoria = Router();

routerCategoria.post("/categoria/cadastrar", categoriacontroller.cadastrar);
routerCategoria.get("/categoria/listar", categoriacontroller.listar)
routerCategoria.patch('/categoria/alterar/:id', categoriacontroller.alterar)