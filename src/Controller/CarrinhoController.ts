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
    let disponivel = true

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
          if(produto.Aluguel.length > 0){
            let qtdDisponivel = produto.Aluguel.filter((aluguel: any) => aluguel.status_aluguel === 'Disponivel').length
            if(item.quantidade > qtdDisponivel){
              disponivel = false
            }
          }else if(produto.Venda.length > 0){
            let qtdDisponivel = produto.Venda.filter((venda: any) => venda.status_venda === 'Disponivel').length
            if(item.quantidade > qtdDisponivel){
              disponivel = false
            }
          }

        }else{
          return res.status(400).json({message: 'Carrinho indisponível'})
        }
      })
    }else{
      return res.status(400).json({message: 'Carrinho indisponível'})
    }

    if(disponivel){
      return res.status(200).json({message: 'Carrinho disponível'})
    }else{
      return res.status(400).json({message: 'Carrinho indisponível'})
    }
  }

  async regisrarCarrinho(req: Request, res: Response) {
    let id = req.params.id

    await prisma.createdCart.create({
      data: {
        cartId: Number(id),
      }
    })

    return res.status(200).json({message: 'Carrinho registrado'})
  }

  async marcarabandonado(req: Request, res: Response) {
    let id = req.params.id

    try{
      await prisma.createdCart.updateMany({
        where: {
          cartId: Number(id),
          resultouVenda: false,
        },
        data: {
          abandonado: true
        }
      })
    }catch(err){
      return res.status(400).json({message: 'Carrinho não encontrado'})
    }
    return res.status(200).json({message: 'Carrinho marcado como abandonado'})
  }

  async marcarvendido(req: Request, res: Response) {
    let id = req.params.id

    await prisma.createdCart.updateMany({
      where: {
        cartId: Number(id),
      },
      data: {
        resultouVenda: true
      }
    })

    return res.status(200).json({message: 'Carrinho marcado como vendido'})
  }
}