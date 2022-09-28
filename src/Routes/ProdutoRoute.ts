import {Router} from "express"
import multer from "multer";
import { ProdutoController } from "../Controller/ProdutoController";
import { storage } from "../utils/multerConfig";

const upload = multer({storage: storage})

const produtocontroller = new ProdutoController()
export const routerProduto = Router();


routerProduto.post("/Produto/Cadastrar",upload.array('file[]', 5), produtocontroller.cadastrar);
routerProduto.get("/Produto", produtocontroller.listar);
routerProduto.patch("/Produto/:id/Alterar", produtocontroller.alterar)
routerProduto.delete("/Produto/:id/Deletar", produtocontroller.excluir)
routerProduto.get("/Produto/ImagePath/:id", produtocontroller.enviarPath)






