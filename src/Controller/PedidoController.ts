import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
const pdf = require("html-pdf");
var Boleto = require('node-boleto').Boleto;
const time = new Date().getTime()

interface IBoleto {
  valor: number;
  data_vencimento: string | Date | any;
  linhadigitavel: string,
  barcode: string,
  nomePDF: string
}

export class PedidoController {
  async gerar(req: Request, res: Response) {
    let today = new Date();
    let {total, cartItens, idUser, metodoPagamento} = req.body

    if(metodoPagamento === "boleto"){
      let dataBoleto: IBoleto = await geraBoleto(total)
      dataBoleto.nomePDF = dataBoleto.nomePDF.substring(20, 33)

      console.log(dataBoleto)

      const itensVendas = cartItens.map(element => {
        if(element.vendas.length > 0){
          return element.vendas.map((item: any) => {
            return item.id
          })
        }
      });

      const itensAlugados = cartItens.map(element => {
        if(element.alugueis.length > 0){
          return element.alugueis.map((item: any) => {
            return item.id
          })
        }
      });

      console.table(itensVendas, itensAlugados)

      if(itensVendas.length > 0){
        vendas = await prisma.venda.create({
          data: {
            data_venda: today,

            user: {
              connect: {
                id: idUser
              }
            },
            pagamento: {
              create: {
                valor: total,
                forma_pagamento: metodoPagamento,

                boleto: {
                  create: {
                    data_venc: dataBoleto.data_vencimento.toDate(),
                    valor: dataBoleto.valor,
                    linhaDigitavel: dataBoleto.linhadigitavel,
                    numeroBoleto: dataBoleto.barcode,
                    nomePDF: dataBoleto.nomePDF
                  }
                }
              }
            }
          }
        })
        if(vendas != null){
          res.status(201).json("Venda realizada com sucesso!")
        }else{
          res.status(400).json("Erro ao realizar a venda!")
        }
      }
    }
  }

  async listarPeloId(req: Request, res: Response){
    const {id} = req.params

    const compras = await prisma.venda.findMany({
      where: {
        userId: Number(id)
      },
      include: {
        pagamento: true
      }
    })
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

    return {
      linhadigitavel: boleto.linha_digitavel, 
      barcode: boleto.barcode_data, 
      nomePDF: nomePDF,
      data_vencimento: boleto.data_vencimento,
      valor: boleto.valor
    }
}
