import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
const pdf = require("html-pdf");
var Boleto = require('node-boleto').Boleto;
const time = new Date().getTime()

interface IBoleto {
  linhadigitavel: string,
  barcode: string,
  nomePDF: string
}

export class VendaController {
  async gerar(req: Request, res: Response) {
   let {total, cartItens, idUser, metodoPagamento} = req.body

    if(metodoPagamento === "boleto"){
      let dataBoleto: IBoleto = await geraBoleto(total)
      dataBoleto.nomePDF = dataBoleto.nomePDF.substring(20, 33)

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
      
      if(!venda){ 
        return res.status(400).json({message: "Erro ao gerar venda"})
      }else{
        return res.status(201).json({message: "Venda gerada com sucesso"})
      }
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
      });
    });

    return {linhadigitavel: boleto.linha_digitavel, barcode: boleto.barcode_data, nomePDF: nomePDF}
}