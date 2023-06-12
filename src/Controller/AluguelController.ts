import { Request, Response } from "express";
import {DateTime} from "luxon"
import { prisma } from "../utils/prisma";

export class AluguelController {
  async listar (req: Request, res: Response) {
    const alugueis = await prisma.aluguel.findMany({
      where: {
        NOT: {
          status_aluguel: "Disponivel",
        }
      },
      include: {
        produto: true,
        Pedido: {
          include: {
            user: true,
            endereco: true,
            Pagamento: true,
            vendas: {
              include: {
                produto: {
                  include: {
                    Categorias: true,
                  }
                },
                produto_mudanca: true,
              }
            },
            alugueis: {
              include: {
                produto: {
                  include: {
                    Categorias: true,
                  }
                },
                produto_mudanca: true,
              }
            },

          }
        }
      }
    })

    alugueis.forEach(async (aluguel:any) => {
      if(aluguel.status_aluguel === 'Atrasado'){
        const data_expiracao = DateTime.fromJSDate(aluguel.data_expiracao)
        let today = DateTime.now()
        const diff = data_expiracao.diff(today, 'days').toObject()
        aluguel.dias_atrasados = diff.days
        aluguel.dias_atrasados = Math.floor(Math.abs(aluguel.dias_atrasados))
        
      }
    })

    return res.json(alugueis)
  }
}