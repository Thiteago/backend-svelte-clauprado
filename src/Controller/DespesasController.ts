import { Request, Response } from "express";
import {DateTime} from "luxon"
import { prisma } from "../utils/prisma";

export class DespesasController {
  async cadastrar(req: Request, res: Response) {
    let {valor, descricao, tipo, recorrente, tipoRecorrencia, data} = req.body
    let new_data = data ? DateTime.fromISO(data).toJSDate() : new Date()
    valor = valor.replace('R$','')
    valor = parseFloat(valor)

    const despesa = await prisma.despesas.create({
      data: {
        valor,
        descricao,
        tipoDespesa: tipo,
        recorrente: recorrente === 'true' ? true : false,
        tipoDeRecorrencia: recorrente === 'true' ? tipoRecorrencia : null,
        data: new_data
      }
    })

    if(!despesa) {
      return res.status(400).json({error: 'Erro ao cadastrar despesa'})
    }
    return res.status(201).json({despesa})

  }

  async listar(req: Request, res: Response) {
    let  { mes, dia } = req.query
    let despesas:any = []
    
    if(mes && dia) {
      let data = new Date(Date.UTC(2023, Number(mes) - 1, Number(dia)));
      let startDate = new Date(data.getTime());
      let endDate = new Date(data.getTime() + 24 * 60 * 60 * 1000 - 1);

      despesas = await prisma.despesas.findMany({
        where: {
          data: {
            gte: startDate,
            lt: endDate
          }
        }
      })
    }else if(mes) {
      let data = new Date(`2023-${Number(mes) - 1}-01`);
      let startDate = new Date(data.getFullYear(),Number(mes) - 1, 1);
      let endDate = new Date(data.getFullYear(), Number(mes), 0);

      despesas = await prisma.despesas.findMany({
        where: {
          data: {
            gte: startDate.toISOString(),
            lt: endDate.toISOString()
          }
        }
      })
    }
    if(!despesas) {
      return res.status(400).json({error: 'Erro ao listar despesas'})
    }
    return res.status(201).json(despesas)
    
  }

  async editar(req: Request, res: Response) {
    let id = req.params.id
    let {valor, descricao, tipo, recorrente, tipoRecorrencia, data} = req.body
    valor = valor.replace('R$','')
    valor = parseFloat(valor)
    let new_data = data ? DateTime.fromISO(data).toJSDate() : new Date()

    const despesa = await prisma.despesas.update({
      where: {
        id: parseInt(id)
      },
      data: {
        valor,
        descricao,
        tipoDespesa: tipo,
        recorrente: recorrente === 'true' ? true : false,
        tipoDeRecorrencia: recorrente === 'true' ? tipoRecorrencia : null,
        data: new_data
      }
    })

    if(!despesa) {
      return res.status(400).json({error: 'Erro ao editar despesa'})
    }
    return res.status(201).json({despesa})
  }

  async deletar(req: Request, res: Response){
    let selectedItems = req.body
    let ids = selectedItems.map((item: any) => parseInt(item.id))

    let despesa = await prisma.despesas.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    
    if(!despesa) {
      return res.status(400).json({error: 'Erro ao deletar despesa'})
    }
    return res.status(201)
  }
}
