import { Request, Response } from "express";
import {DateTime} from "luxon"
import { prisma } from "../utils/prisma";

export class AvaliacoesController {
  async cadastrar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nota, descricao, id_usuario, titulo } = req.body;

    const avaliacao = await prisma.avaliacoes.create({
      data: {
        nota: nota,
        titulo: titulo,
        descricao: descricao,
        produto: {
          connect: {
            id: id,
          },
        },
        user: {
          connect: {
            id: id_usuario,
          },
        },
      },
    });

    if(!avaliacao){
      return res.status(400).json({message: "Erro ao cadastrar avaliação"})
    }
    return res.status(201).json({message: "Avaliação cadastrada com sucesso"})
  }

  async listar(req: Request, res: Response) {
    let id = Number(req.params.id);

    const avaliacoes = await prisma.avaliacoes.findMany({
      where: {
        produtoId: id,
      },
      include: {
        user: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!avaliacoes) {
      return res.status(400).json({ message: "Erro ao listar avaliações" });
    }
    return res.status(200).json(avaliacoes);
  }

  async editar(req: Request, res: Response) {
    
  }

  async deletar(req: Request, res: Response){

  }

  async verificarUsuario(req: Request, res: Response) {
    //verifica se o usuario ja comprou o produto
    const { id_usuario, id_produto } = req.body;
    let comprou = false;
    
    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(id_usuario),
      },
      include: {
        pedidos: {
          where: {
            OR: [
              { status: "pago" },
              { status: "Finalizado" },
              { status: "devolvido" },
              { status: "Aguardando Envio" },
            ],  
          },
          include: {
            vendas: {
              where: {
                produtoId: id_produto,
              },
            },
            alugueis: {
              where: {
                produtoId: id_produto,
              },
            },
          },
        },
      },
    });


    if (usuario) {
      usuario.pedidos.map(element => {
        if(element.vendas.length > 0 || element.alugueis.length > 0){
          comprou = true;
        }else{
          comprou = false;
        }
      });
    }else{
      comprou = false;
    }
    return res.json(comprou);
  }

  async listarInicio(req: Request, res: Response) {
    const avaliacoes = await prisma.avaliacoes.findMany({
      take: 3,
      orderBy: {
        nota: "desc",
      },
      where: {
        nota: {
          gte: 50,
        },
      },
      include: {
        user: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!avaliacoes) {
      return res.status(400).json({ message: "Erro ao listar avaliações" });
    }

    return res.status(200).json(avaliacoes);
  }
}
