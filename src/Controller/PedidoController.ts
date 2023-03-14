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

function formatDate(date: any){
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
      cartao,
      vezes
    } = req.body
    let produtosAlugados = cartItens.filter((element: any) => element.Aluguel.length > 0)
    let produtosVendidos = cartItens.filter((element: any) => element.Venda.length > 0) 

    valor_frete = parseFloat(valor_frete)

    if(produtosAlugados.length > 0) {
      produtosAlugados.forEach(async (element: any) => {
        for(let i = 0; i < element.quantidade; i++) {
          await prisma.aluguel.update({
            where: {
              id: element.Aluguel[i].id
            },
            data: {
              data_aluguel: formatDate(element.Aluguel[i].data_aluguel),
              data_disponibilidade: formatDate(element.Aluguel[i].data_disponibilidade),
              data_expiracao: formatDate(element.Aluguel[i].data_expiracao),
              dias_alugados: element.Aluguel[i].dias_alugados,
              status_aluguel: 'Pendente - Aguardando Pagamento',
            }
          })
        }
      })
    }

    if(produtosVendidos.length > 0){
      produtosVendidos.forEach(async (element: any) => {
        for(let i = 0; i < element.quantidade; i++) {
          await prisma.venda.update({
            where: {
              id: element.Venda[i].id
            },
            data: {
              status_venda: 'Pendente - Aguardando Pagamento'
            } 
          })
        }
      })
    }

    if(metodoPagamento === "cartao"){
      await prisma.pedido.create({
        data: {
          valor: total,
          userId: idUser,
          enderecoId: endereco.id,
          tipo_frete,
          valor_frete,
          
          Pagamento: {
            create: {
              valor: total,
              vezes: vezes.toString(),
              forma_pagamento: metodoPagamento,

              cartao: {
                create: {
                  numero: cartao.numero,
                  nome: cartao.nome,
                  validade: cartao.validade,
                  bandeira: cartao.bandeira
                }
              }
            }
          }
        }
      }).then((pedidoCriado: any) => {
        produtosAlugados.forEach(async (element: any) => {
          for(let i = 0; i < element.quantidade; i++) {
            await prisma.aluguel.update({
              where: {
                id: element.Aluguel[i].id
              },
              data: {
                pedidoId: pedidoCriado.id
              }
            })
          }
        })
        produtosVendidos.forEach(async (element: any) => {
          for(let i = 0; i < element.quantidade; i++) {
            await prisma.venda.update({
              where: {
                id: element.Venda[i].id
              },
              data: {
                pedidoId: pedidoCriado.id
              } 
            })
          }
        })

      cartItens.forEach(async (element: any) => {
        await prisma.produto.update({
          where: {
            id: element.id
          },
          data: {
            quantidadeEmEstoque: {
              decrement: element.quantidade
            },
          }
        })
      })
      return res.status(200).json({message: "Pedido gerado com sucesso"})
      })
    } 
  

    if(metodoPagamento === "boleto"){
      let dataBoleto: IBoleto = await geraBoleto(total)
      dataBoleto.nomePDF = dataBoleto.nomePDF.substring(20, 33)

      await prisma.pedido.create({
        data: {
          valor: total,
          userId: idUser,
          enderecoId: endereco.id,
          tipo_frete,
          valor_frete,

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
      }).then((pedidoCriado: any) => {
        produtosAlugados.forEach(async (element: any) => {
          for(let i = 0; i < element.quantidade; i++) {
            await prisma.aluguel.update({
              where: {
                id: element.Aluguel[i].id
              },
              data: {
                pedidoId: pedidoCriado.id
              }
            })
          }
        })
        produtosVendidos.forEach(async (element: any) => {
          for(let i = 0; i < element.quantidade; i++) {
            await prisma.venda.update({
              where: {
                id: element.Venda[i].id
              },
              data: {
                pedidoId: pedidoCriado.id
              } 
            })
          }
        })
      })

      cartItens.forEach(async (element: any) => {
        await prisma.produto.update({
          where: {
            id: element.id
          },
          data: {
            quantidadeEmEstoque: {
              decrement: element.quantidade
            },
          }
        })
      })
      res.status(200).json({message: "Pedido gerado com sucesso"})
    }else{
      return res.status(400).json({message: "Erro ao gerar pedido"})
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
            boleto: true,
            cartao: true
          }
        },
        endereco: true,
      }
    })

    if(pedidos.length > 0){
      return res.status(200).json(pedidos)
    }else{
      return res.status(400).json({message: "Nenhum pedido encontrado"})
    }
  }

  async listarTodos(req: Request, res: Response){
    const pedidos = await prisma.pedido.findMany({
      include: {
        vendas: {
          include: {
            produto: true,
          }
        },
        alugueis: {
          include: {
            produto: true,
          }
        },
        user: {
          select: {
            cpf: true,
            dataNascimento: true,
            id: true,
            numeroCel: true,
            numeroTel: true,
            nome: true,
            email: true
          }
        },
        Pagamento: {
          include: {
            boleto: true,
            cartao: true
          }
        },
        endereco: true,
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
