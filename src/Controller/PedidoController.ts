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

function formatDate(date){
  let data = new Date(date)
  let formatedDate = new Date(data.getTime() - data.getTimezoneOffset() * -60000)
  return formatedDate
}

export class PedidoController {
  async gerar(req: Request, res: Response) {
    let {total,
      tipo_frete,
      valor_frete,
      cartItens, 
      idUser,
      metodoPagamento,
      endereco,
    } = req.body
    let produtosAlugados = cartItens.filter((element: any) => element.Aluguel != null)
    let produtosVendidos = cartItens.filter((element: any) => element.Venda != null)
    

    valor_frete = parseFloat(valor_frete)


    if(produtosAlugados.length > 0) {
      await prisma.aluguel.updateMany({
        where: {
          id: {
            in: produtosAlugados.map((element: any) => element.Aluguel.id)
          }
        },
        data: {
          data_aluguel: formatDate(produtosAlugados[0].Aluguel.data_aluguel),
          data_disponibilidade: formatDate(produtosAlugados[0].Aluguel.data_disponibilidade),
          data_expiracao:formatDate(produtosAlugados[0].Aluguel.data_expiracao),
          status_aluguel: produtosAlugados[0].quantidadeEmEstoque > 0 ? "Disponível" : "Indisponível",
          dias_alugados: produtosAlugados[0].Aluguel.dias_alugados,
        }
      })
    }

    if(produtosVendidos.length > 0){
      await prisma.venda.updateMany({
        where: {
          id: {
            in: produtosVendidos.map((element: any) => element.Venda.id)
          }
        },
        data: {
          status_venda: produtosVendidos[0].quantidadeEmEstoque > 0 ? "Disponível" : "Indisponível",
        }
      })
    }

     if(metodoPagamento === "boleto"){
      let dataBoleto: IBoleto = await geraBoleto(total)
      dataBoleto.nomePDF = dataBoleto.nomePDF.substring(20, 33)

      let itens = cartItens.flatMap(element => {
        let itensList = []
        if(element.Venda != null){
          itensList.push(element.Venda.produtoId)
        }
        if(element.Aluguel != null){
          itensList.push(element.Aluguel.produtoId)
        }
        return itensList
      });

      if(itens.length > 0){
        await prisma.pedido.create({
          data: {
            valor: total,
            userId: idUser,
            enderecoId: endereco.id,
            tipo_frete,
            valor_frete,
            
            produtos: {
              connect: itens.map(id => ({ id })),
            },

            Pagamento: {
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

        await prisma.produto.updateMany({
          where: {
            id: {
              in: itens
            }
          },
          data: {
            quantidadeEmEstoque: {
              decrement: 1
            },
          }
        })
        res.status(200).json({message: "Pedido gerado com sucesso"})
      }else{
        res.status(400).json({message: "Erro ao gerar pedido"})
      }
    }
  }

  async listarPeloId(req: Request, res: Response){
    const {id} = req.params

    const pedidos = await prisma.pedido.findMany({
      where: {
        userId: Number(id)
      },
      include: {
        Pagamento: {
          include: {
            boleto: true
          }
        },
        endereco: true,
        produtos: true
      }
    })

    if(pedidos.length > 0){
      res.status(200).json(pedidos)
    }else{
      res.status(400).json({message: "Nenhum pedido encontrado"})
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

    return {
      linhadigitavel: boleto.linha_digitavel, 
      barcode: boleto.barcode_data, 
      nomePDF: nomePDF,
      data_vencimento: boleto.data_vencimento,
      valor: boleto.valor
    }
}
