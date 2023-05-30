import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class SlideController{
  async cadastrar(req: Request, res: Response){
    let ids: Array<string> = [];
    var myfiles = JSON.parse(JSON.stringify(req.files))
    
    myfiles.map((item: any) => {
      //remove any special characters from the filename but keep the extension

      item.filename = item.filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ._-]/g, '');
      
      ids.push(item.filename)
    })

    const { titulo, descricao, link } = req.body;
    const slide = await prisma.slide.create({
      data: {
        titulo,
        descricao,
        link,
        imagem: ids[0],
      }
    })

    return res.status(201).json(slide)

  }

  async alterar(req: Request, res: Response){
  }

  async listar(req: Request, res: Response){
    const slides = await prisma.slide.findMany({
      orderBy: {
        id: "desc"
      }
    })

    return res.status(200).json(slides)
  }
}