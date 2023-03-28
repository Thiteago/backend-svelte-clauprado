import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class CarrinhoController {
  async calcularFrete(req: Request, res: Response) {
    let cep = req.params.cep;

    const response = await fetch(`https://www.cepcerto.com/ws/json-frete/12460000/${cep}/500`, {
      method: 'POST',
    });

    const data = await response.json();
    
    return res.json(data);
  }

  async verificarDisponibilidade(req: Request, res: Response) {
    const carrinho = req.body;

    if(Object.keys(carrinho).length > 0){
     carrinho.forEach(async (item: any) => {
      const produto = await prisma.produto.findUnique({
        where: {
          id: item.id
        },
        include: {
          Venda: true,
          Aluguel: true
        }
      })

      if(produto){
        if(item.quantidade > produto?.Venda.length || item.quantidade > produto?.Aluguel.length){
          return res.status(400).json({message: 'Carrinho indisponível'})
        }
      }else{
        return res.status(400).json({message: 'Carrinho indisponível'})
      }
     })

      return res.status(200).json({message: 'Carrinho disponível'})
    }
  }
}