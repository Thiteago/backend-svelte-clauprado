import {Router} from "express"
import multer from "multer";
import { ProdutoController } from "../Controller/ProdutoController";
import { storage } from "../utils/multerConfig";

const upload = multer({storage: storage})


const produtocontroller = new ProdutoController()
export const routerProduto = Router();


routerProduto.post("/Produto/Cadastrar",upload.array('imagens', 4), produtocontroller.cadastrar);
routerProduto.post("/Produto/Visualizou/:id", produtocontroller.marcarVisualizacao)

routerProduto.get("/Produto", produtocontroller.listar);
routerProduto.get("/Produto/:id", produtocontroller.listarpeloid)
routerProduto.get("/categoria/listar", produtocontroller.listarCategorias)

routerProduto.patch("/Produto/:id/Alterar",upload.array('imagens', 4), produtocontroller.alterar)

routerProduto.delete("/Produto/:id/Deletar", produtocontroller.excluir)






