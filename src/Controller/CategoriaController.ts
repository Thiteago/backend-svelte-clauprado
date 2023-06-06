import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class CategoriaController {
  async cadastrar(req: Request, res: Response) {
    const { nome } = req.body;
    try {
      const categoria = await prisma.categorias.create({
        data: {
          nome,
        },
      });
      return res.status(201).json(categoria);
    } catch (error:any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar (req: Request, res: Response) {
    try {
      const categorias = await prisma.categorias.findMany()
      return res.status(200).json(categorias)
    } catch (error:any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async alterar (req: Request, res: Response) {
    const { id } = req.params
    const { nome } = req.body
    console.log(nome)
    try {
      const categoria = await prisma.categorias.update({
        where: {
          id: Number(id)
        },
        data: {
          nome
        }
      })
      return res.status(200).json(categoria)
    } catch (error:any) {
      return res.status(400).json({ error: error.message });
    }
  }
}