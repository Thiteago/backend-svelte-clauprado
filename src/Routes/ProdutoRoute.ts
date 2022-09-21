import {Router} from "express"
import multer from "multer";
import { ProdutoController } from "../Controller/ProdutoController";
import { storage } from "../utils/multerConfig";

const upload = multer({storage: storage})

const produtocontroller = new ProdutoController()
export const routerProduto = Router();


routerProduto.post("/Produto/Cadastrar", produtocontroller.cadastrar);
routerProduto.post("/Upload", upload.single('file'), produtocontroller.inserirImagem)





