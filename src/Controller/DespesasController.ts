import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class DespesasController {
  async cadastrar(req: Request, res: Response) {
    let  {valor, descricao, tipo, recorrente, tipoRecorrencia} = req.body
    console.log(req.body)
    console.log(valor)
    valor = valor.replace('R$','')
    valor = parseFloat(valor)

    const despesa = await prisma.despesas.create({
      data: {
        valor,
        descricao,
        tipoDespesa: tipo,
        recorrente: recorrente === 'true' ? true : false,
        tipoDeRecorrencia: recorrente === 'true' ? tipoRecorrencia : null
      }
    })

    if(!despesa) {
      return res.status(400).json({error: 'Erro ao cadastrar despesa'})
    }
    return res.status(201).json({despesa})

  }

  async listar(req: Request, res: Response) {
    let  { mes, dia } = req.query
    let despesas = []
    
    // query para listar despesas do mes e dia onde o banco espera uma data completa
    if(mes && dia) {
      let data = new Date(`2023-${mes}-${dia}`)
      let startDate = new Date(data.getFullYear(), data.getMonth(), data.getDate())
      let endDate = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1)
      console.log(data)
      despesas = await prisma.despesas.findMany({
        where: {
          data: {
            gte: startDate,
            lt: endDate
          }
        }
      })
    }else if(mes) {
      let data = new Date(`2023-${mes}-01`)
      let startDate = new Date(data.getFullYear(), data.getMonth(), 1, 0, 0, 0, 0)
      let endDate = new Date(data.getFullYear(), data.getMonth(), 31)
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
}
