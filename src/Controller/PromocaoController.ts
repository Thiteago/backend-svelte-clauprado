import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import {DateTime} from "luxon"

export class PromocaoController {
  async cadastrar(req: Request, res: Response) {
    let { nome, valor_desconto, data_inicio, data_fim, tipo,categorias, produtos} = req.body;
    let produtosPorCategoria = []
    let temMenorQueUm = false
    let produtosPorId:any = []
    let today = new Date()
    let isAgendado = new Date(data_inicio) > today ? true : false

    valor_desconto = valor_desconto.replace('%','')
    valor_desconto = valor_desconto.replace('R$','')
    valor_desconto = parseFloat(valor_desconto) 

    if(categorias.length === 0 && produtos.length === 0) {
      return res.status(400).json({error: 'Erro ao cadastrar promoção'})
    }
    

    if(categorias.length > 0) {
      for(let i = 0; i < categorias.length; i++) {
        const produtos_categoria = await prisma.produto.findMany({
          where: {
            categoriasId: Number(categorias[i])
          }
        })
        produtosPorCategoria.push(...produtos_categoria)
      }
      produtosPorId = produtosPorCategoria.map((produto:any) => produto.id)
    }

    if(produtos.length > 0) {
      produtos.forEach((element: any)=> {
        if(!produtosPorId.includes(element)){
          produtosPorId = [...produtosPorId, element]
        }
      });
    }

    if(produtosPorId.length > 0){
      for(let i = 0; i < produtosPorId.length; i++) {
        await prisma.produto.findFirst({
          where: {
            id: Number(produtosPorId[i])
          }
        }).then((produto: any) => {
          if(tipo === "porcentual") {
            if(produto.valor - (produto.valor * (valor_desconto / 100)) <= 1) {
              temMenorQueUm = true
              return
            }
          } else {
            if(produto.valor - valor_desconto <= 1) {
              temMenorQueUm = true
              return
            }
          }
        })
      }
    }

    if (temMenorQueUm) { 
      return res.status(400).json({error: 'Erro ao cadastrar promoção'})
    } 
      

    const promocao = await prisma.promocao.create({
      data: {
        nome,
        data_inicio: new Date(data_inicio),
        data_fim: new Date(data_fim),
        tipo,
        valor_desconto,
        status: isAgendado ? "Agendado" : "Ativo",
        produtos: {
          connect: produtosPorId.map((id: any) => ({ id: Number(id) }))
        },
        categorias:{
          connect: categorias.map((id: any) => ({ id: Number(id) }))
        }
      },
    });

    if(!promocao) {
      return res.status(400).json({error: 'Erro ao cadastrar promoção'})
    }
    return res.status(201).json({promocao})
  }

  async listar(req: Request ,res: Response) {
    const promocoes = await prisma.promocao.findMany(
      {
        include: {
          produtos: true,
          categorias: true
        }
      }
    );
    if(!promocoes || promocoes.length === 0) {
      return res.status(400).json({error: 'Erro ao listar promoções'})
    } 
    return res.json(promocoes)
  }

  async desabilitar(req: Request, res: Response) {
    const id = Number(req.params.id)
    const promocao = await prisma.promocao.update({
      where: {
        id
      },
      data: {
        status: "Inativo"
      }
    })
    if(!promocao) {
      return res.status(400).json({error: 'Erro ao desabilitar promoção'})
    }
    return res.status(200).json(promocao)
  }

  async listarPromocaoAtiva(req: Request, res: Response) {
    const promocoes = await prisma.promocao.findMany({
      where: {
        status: "Ativo"
      },
      include: {
        produtos: true
      }
    })
    if(!promocoes || promocoes.length === 0) {
      return res.status(400).json({error: 'Erro ao listar promoções'})
    }
    return res.json(promocoes)
  }

  async excluir(req: Request, res: Response) {
    const id = Number(req.params.id)
    const promocao = await prisma.promocao.delete({
      where: {
        id
      }
    })
    if(!promocao) {
      return res.status(400).json({error: 'Erro ao excluir promoção'})
    }
    return res.status(200).json(promocao)
  }

  async alterar(req: Request, res: Response) {
    const id = Number(req.params.id)
    let { nome, valor_desconto, data_inicio, data_fim, tipo, categorias, produtos } = req.body
    let produtosPorCategoria = []
    let produtosPorId:any = []
    let today = new Date()
    data_inicio = DateTime.fromISO(data_inicio).toJSDate()
    data_fim = DateTime.fromISO(data_fim).toJSDate()
    let isAgendado = new Date(data_inicio) > today ? true : false

    if(typeof(valor_desconto) === 'string'){
      valor_desconto = valor_desconto.replace('%','')
      valor_desconto = valor_desconto.replace('R$ ','')
      valor_desconto = parseFloat(valor_desconto)
    }

    if(categorias.length === 0 && produtos.length === 0) {
      return res.status(400).json({error: 'Erro ao cadastrar promoção'})
    }

    if(typeof(categorias) === 'object') {
      categorias = categorias.map((categoria: any) => Number(categoria.id))
    }

    if(categorias.length > 0) {
      for(let i = 0; i < categorias.length; i++) {
        let produtos
          produtos = await prisma.produto.findMany({
            where: {
              categoriasId: Number(categorias[i])
            }
          })
        produtosPorCategoria.push(...produtos)
      }
      produtosPorId = produtosPorCategoria.map((produto:any) => produto.id)
    }

    if(produtos.length > 0) {
      produtos.forEach((element: any)=> {
        if(!produtosPorId.includes(element)){
          produtosPorId = [...produtosPorId, element]
        }
      });
    }

    const promocao = await prisma.promocao.update({
      where: {
        id
      },
      data: {
        nome,
        data_inicio: new Date(data_inicio),
        data_fim: new Date(data_fim),
        tipo,
        valor_desconto: parseFloat(valor_desconto),
        status: isAgendado ? "Agendado" : "Ativo",
        produtos: {
          connect: produtosPorId.map((id: any) => ({ id: Number(id) }))
        },
        categorias:{
          connect: categorias.map((id: any) => ({ id: Number(id) }))
        }
      },
    });

    if(!promocao) {
      return res.status(400).json({error: 'Erro ao cadastrar promoção'})
    }
    return res.status(201).json({promocao})
  }

  async listarPeloId(req: Request, res: Response) {
    const { id } = req.params
    const promocao = await prisma.promocao.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        produtos: true,
        categorias: true
      }
    })
    if(!promocao) {
      return res.status(400).json({error: 'Erro ao listar promoção'})
    }
    return res.status(200).json(promocao)
  }
}
