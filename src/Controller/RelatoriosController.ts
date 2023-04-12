import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

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

}