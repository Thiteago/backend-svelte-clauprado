import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import  { DateTime }   from 'luxon'


export class RelatoriosController {

  async vendasDiarias(req: Request, res: Response) {
    const pedidos = await prisma.pedido.findMany({
      where: {
        data_pedido: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
        
        Pagamento: {
          status: "Pago",
        },
      },
      include: {
        vendas: true,
        alugueis: true,
      },
    });
    
    if(!pedidos) return res.status(404).json({message: "Nenhum pedido encontrado"})
    
    return res.json(pedidos);
  }

  async conversaoDeVendas(req: Request, res: Response) {
    const pedidos = await prisma.pedido.findMany({
      where: {
        data_pedido: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
        Pagamento: {
          status: "Pago",
        },
      },
      include: {
        vendas: true,
        alugueis: true,
      },
    });

    const visitas = await prisma.visit.findMany({
      where: {
        date: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });



    if(!pedidos || !visitas) return res.status(404).json({message: "Nenhum pedido encontrado"})
    
    return res.json({'pedido': pedidos, 'visitas': visitas});
  }

  async carrinhosAbandonados(req: Request, res: Response) {
    const carts = await prisma.createdCart.findMany({
      where: {
        date: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
        abandonado: true,
      },
    });

    const cartsCount = await prisma.createdCart.findMany({
      where: {
        date: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      }
    })

    if(!carts) return res.status(404).json({message: "Nenhum carrinho encontrado"})
    return res.status(200).json({'cartsAbandoned': carts, 'cartsCreated': cartsCount})
  }

  async desempenhoDeProdutos(req: Request, res: Response) {
    const produtos = await prisma.produto.findMany({
      include: {
        statisticProduct: true,
      },
    })

    if(!produtos) return res.status(404).json({message: "Nenhum produto encontrado"})
    return res.status(200).json(produtos)
  }

  async vendasDiariasSelecionar(req: Request, res: Response) {
    let { dataInicial, dataFinal } = req.body

    if (!dataInicial || !dataFinal) {
      return res.status(400).json({ message: "Data inicial ou final ausente" });
    }

    dataFinal = DateTime.fromISO(dataFinal).endOf('day').toISO()!
    dataInicial = DateTime.fromISO(dataInicial).startOf('day').toISO()!

    const pedidos = await prisma.pedido.findMany({
      where: {
        data_pedido: {
          gte: dataInicial,
          lte: dataFinal,
        },
        Pagamento: {
          status: "Pago",
        },
      },
      include: {
        vendas: true,
        alugueis: true,
      },
    });

    if(!pedidos) return res.status(404).json({message: "Nenhum pedido encontrado"})

    return res.json(pedidos);
  }

  async conversaoDeVendasSelecionar(req: Request, res: Response) {
    let { dataInicial, dataFinal } = req.body

    if (!dataInicial || !dataFinal) {
      return res.status(400).json({ message: "Data inicial ou final ausente" });
    }

    dataFinal = DateTime.fromISO(dataFinal).endOf('day').toISO()!
    dataInicial = DateTime.fromISO(dataInicial).startOf('day').toISO()!

    const pedidos = await prisma.pedido.findMany({
      where: {
        data_pedido: {
          gte: dataInicial,
          lte: dataFinal,
        },
        Pagamento: {
          status: "Pago",
        },
      },
      include: {
        vendas: true,
        alugueis: true,
      },
    });

    const visitas = await prisma.visit.findMany({
      where: {
        date: {
          gte: dataInicial,
          lte: dataFinal,
        },
      },
    });

    if(!pedidos || !visitas) return res.status(404).json({message: "Nenhum pedido encontrado"})

    return res.json({'pedido': pedidos, 'visitas': visitas});
  }

  async carrinhosAbandonadosSelecionar(req: Request, res: Response) {
    let { dataInicial, dataFinal } = req.body

    if (!dataInicial || !dataFinal) {
      return res.status(400).json({ message: "Data inicial ou final ausente" });
    }

    dataFinal = DateTime.fromISO(dataFinal).endOf('day').toISO()!
    dataInicial = DateTime.fromISO(dataInicial).startOf('day').toISO()!

    const carts = await prisma.createdCart.findMany({
      where: {
        date: {
          gte: dataInicial,
          lte: dataFinal,
        },
        abandonado: true,
      },
    });

    const cartsCount = await prisma.createdCart.findMany({
      where: {
        date: {
          gte: dataInicial,
          lte: dataFinal,
        },
      }
    })

    if(!carts) return res.status(404).json({message: "Nenhum carrinho encontrado"})

    return res.status(200).json({'cartsAbandoned': carts, 'cartsCreated': cartsCount})
  }

  async desempenhoDeProdutosSelecionar(req: Request, res: Response) {
  }
}