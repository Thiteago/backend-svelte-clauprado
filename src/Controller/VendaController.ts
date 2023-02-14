import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
const pdf = require("html-pdf");
var Boleto = require('node-boleto').Boleto;
const time = new Date().getTime()

export class VendaController {
  async gerar(req: Request, res: Response) {
   let {total, cartItens, idUser, metodoPagamento} = req.body

    if(metodoPagamento === "boleto"){
      let dataBoleto = await geraBoleto(total)

      const venda = await prisma.venda.create(
        {
          data: {
            produtos: {
              connect: cartItens.map((item: any) => {
                return {id: item.id}
              })
            },
            pagamento: {
              create: {
                valor: parseFloat(total),
                forma_pagamento: metodoPagamento,
                boleto: {
                  create: {
                    valor: parseFloat(total),
                    linhaDigitavel: dataBoleto.linhadigitavel,
                    numeroBoleto: dataBoleto.barcode,
                    nomePDF: dataBoleto.nomePDF,
                  }
                }
              }
            },
            user: {
              connect: {
                id: idUser
              }
            }
          }
        }
      )
    }
  }
}

async function geraBoleto(valor: number){
  valor = valor * 100
  let nomePDF = `./src/boletos/boleto${time}.pdf`

  const boleto = new Boleto({
    'banco': "santander", // nome do banco dentro da pasta 'banks'
    'data_emissao': new Date(),
    'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente
    'valor': valor, // R$ 15,00 (valor em centavos)
    'nosso_numero': "1234567",
    'numero_documento': "123123",
    'cedente': "Pagar.me Pagamentos S/A",
    'cedente_cnpj': "18727053000174", // sem pontos e traços
    'agencia': "3978",
    'codigo_cedente': "6404154", // PSK (código da carteira)
    'carteira': "102"
  });

    await boleto.renderHTML(async function (html: any) {
      await pdf.create(html).toFile(nomePDF, function (err: any, res: any) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
      });
    });

    console.log("nomepdf" + nomePDF)

    return {linhadigitavel: boleto.linha_digitavel, barcode: boleto.barcode_data, nomePDF: nomePDF}
}