import {Router} from "express"
import { CarrinhoController } from "../Controller/CarrinhoController";



const carrinhocontroller = new CarrinhoController()
export const routerCarrinho = Router();


routerCarrinho.get("/carrinho/frete/:cep", carrinhocontroller.calcularFrete);







