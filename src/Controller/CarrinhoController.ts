import { Request, Response } from "express";
import { prisma } from "../utils/prisma";






export class CarrinhoController {
  async calcularFrete(req: Request, res: Response) {
    let cep = req.params.cep;

    const response = await fetch(`https://www.cepcerto.com/ws/json-frete/12460000/${cep}/500`, {
      method: 'POST',
    });

    const data = await response.json();
    
    return res.json(data);
  }
}