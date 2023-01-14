import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
let Correios = require('node-correios');
let correios = new Correios();




export class CarrinhoController {
  async calcularFrete(req: Request, res: Response) {
    let cep = req.params.cep;
    console.log(cep)
    let args = {
      nCdServico: '04014',
      sCepOrigem: '12460000',
      sCepDestino: cep,
      nVlPeso: '1',
      nCdFormato: '1',
      nVlComprimento: '16',
      nVlAltura: '2',
      nVlLargura: '11',
      nVlDiametro: '0',
    }

    correios.calcPreco(args)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
  }
}