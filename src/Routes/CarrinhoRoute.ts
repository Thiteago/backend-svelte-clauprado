import {Router} from "express"
import { CarrinhoController } from "../Controller/CarrinhoController";



const carrinhocontroller = new CarrinhoController()
export const routerCarrinho = Router();


routerCarrinho.get("/carrinho/frete/:cep", carrinhocontroller.calcularFrete);
routerCarrinho.post("/carrinho/marcarvenda/:id", carrinhocontroller.marcarvendido)
routerCarrinho.post("/carrinho/marcarabandono/:id", carrinhocontroller.marcarabandonado)
routerCarrinho.post('/carrinho/registar/:id', carrinhocontroller.regisrarCarrinho)
routerCarrinho.post('/carrinho/verificarDisponibilidade', carrinhocontroller.verificarDisponibilidade)







