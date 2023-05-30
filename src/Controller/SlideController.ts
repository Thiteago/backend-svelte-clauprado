import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class SlideController{
  async cadastrar(req: Request, res: Response){
    let ids: Array<string> = [];
    var myfiles = JSON.parse(JSON.stringify(req.files))
    
    myfiles.map((item: any) => {
      ids.push(item.filename)
    })

    const { titulo, descricao, link } = req.body;

    const slide = await prisma.slide.create({
      data: {
        titulo,
        descricao,
        link,
        imagens: ids,
      }
    })

    return res.status(201).json(slide)
    
  }

  async alterar(req: Request, res: Response){
  }
}