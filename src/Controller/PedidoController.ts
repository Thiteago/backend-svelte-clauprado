import { Request, Response } from "express";
const { CLIENT_ID, APP_SECRET } = process.env;
import { prisma } from "../utils/prisma";
const pdf = require("html-pdf");
var Boleto = require('node-boleto').Boleto;
const time = new Date().getTime()
const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com"
};

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
      enderecoDeEntrega,
      cartao,
      vezes
    } = req.body
    let produtosAlugados = cartItens.filter((element: any) => element.Aluguel.length > 0)
    let produtosVendidos = cartItens.filter((element: any) => element.Venda.length > 0) 

    valor_frete = parseFloat(valor_frete)

    if(produtosAlugados || produtosVendidos){
      if(produtosAlugados.length > 0) {
        produtosAlugados.forEach(async (element: any) => {
          for(let i = 0; i < element.quantidade; i++) {
            console.log(element.Aluguel[i].dias_alugados)
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
    }

    if(metodoPagamento === "cartao"){
      await prisma.pedido.create({
        data: {
          valor: total,
          userId: idUser,
          enderecoId: enderecoDeEntrega.id,
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
          enderecoId: enderecoDeEntrega.id,
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
    }
    
    if(metodoPagamento === "paypal"){
      const paypalOrder = await createOrder(total)
      await prisma.pedido.create({
        data: {
          valor: total,
          userId: idUser,
          enderecoId: enderecoDeEntrega.id,
          tipo_frete,
          valor_frete,
          Pagamento: {
            create: {
              valor: total,
              forma_pagamento: metodoPagamento,
  
                paypal: {
                  create: {
                    id: paypalOrder.id,
                    status: paypalOrder.status,
                    link: paypalOrder.links[0].href
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
          return res.status(200).json(paypalOrder)
      })
    }
  }

  async listarPeloUserId(req: Request, res: Response){
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
      return res.status(404).json({message: "Nenhum pedido encontrado"})
    }
  }

  async listarPeloId(req: Request, res: Response){  
    const {id} = req.params

    const pedido = await prisma.pedido.findUnique({
      where: {
        id: Number(id)
      },
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


    if(pedido){
      return res.status(200).json(pedido)
    }else{
      return res.status(404).json({message: "Nenhum pedido encontrado"})
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
      res.status(404).json({message: "Nenhum pedido encontrado"})
    }
  }

  async alterarProdutos(req: Request, res: Response){
    const {produtosAlugados, produtosVendidos} = req.body
    let produtosAlugadosId: any = []
    let produtosVendidosId: any = []
    let countedProdutosAlugados: any = []
    let countedProdutosVendidos: any = []
    
    if(produtosAlugados.length > 0){
      for(let i = 0; i < produtosAlugados.length ; i++) {

        let aluguel = await prisma.aluguel.findUnique({
          where: {
            id: produtosAlugados[i]
          },
          include: {
            produto: true
          }
        })
        if(aluguel){
          await prisma.aluguel.update({
            where: {
              id: produtosAlugados[i],
            },
            data: {
              data_aluguel: null,
              data_expiracao: null,
              status_aluguel: "Disponivel",
              dias_alugados: 0,
              tipo: "Aluguel",
              pedidoId: null,
              produtoId: aluguel.produto.id
            }
          })
       
          await prisma.pedido.update({
            where: {
              id: Number(req.params.id)
            },
            data: {
              valor: {
                decrement: aluguel.produto.valor * aluguel.dias_alugados
              },
            }
          })

          produtosAlugadosId = [...produtosAlugadosId, aluguel.produto.id]
        }
      }

      countedProdutosAlugados = produtosAlugadosId.reduce((acc: any, val: any) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

      for(let [key, value] of Object.entries(countedProdutosAlugados)){
        await prisma.produto.update({
          where: {
            id: Number(key)
          },
          data: {
            quantidadeEmEstoque: {
              increment: Number(value)
            }
          }
        })
      }
      return res.status(200).json({message: "Produtos removidos com sucesso"})
    }
    if(produtosVendidos.length > 0){
      for(let i = 0; i < produtosVendidos.length ; i++) {
        await prisma.venda.update({
          where: {
            id: produtosVendidos[i],
          },
          data: {
            status_venda: "Disponivel",
            pedidoId: null,
          }
        })

        let venda = await prisma.venda.findUnique({
          where: {
            id: produtosVendidos[i]
          },
          include: {
            produto: true
          }
        })

        if(venda){
          await prisma.pedido.update({
            where: {
              id: Number(req.params.id)
            },
            data: {
              valor: {
                decrement: venda.produto.valor
              },
            }
          })
        }

        const vendas = await prisma.venda.findUnique({
          where: {
            id: produtosVendidos[i]
          },
          include: {
            produto: true
          }
        })


        if(vendas){
          produtosVendidosId = [...produtosVendidosId, vendas.produto.id]
        }
      }

      countedProdutosVendidos = produtosVendidosId.reduce((acc: any, val: any) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

      for(let [key, value] of Object.entries(countedProdutosVendidos)){
        await prisma.produto.update({
          where: {
            id: Number(key)
          },
          data: {
            quantidadeEmEstoque: {
              increment: Number(value)
            }
          }
        })
      }
      return res.status(200).json({message: "Produtos devolvidos com sucesso"})
    }else{
      return res.status(404).json({message: "Nenhum produto encontrado"})
    }
    
  }

  async cancelarPedido(req: Request, res: Response){
    const {id} = req.params

    const pedido = await prisma.pedido.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        alugueis: {
          include: {
            produto: true
          }
        },
        vendas: {
          include: {
            produto: true
          }
        }
      }
    })

    if(pedido){
      if(pedido.alugueis.length > 0){
        for(let i = 0; i < pedido.alugueis.length ; i++) {
          await prisma.aluguel.update({
            where: {
              id: pedido.alugueis[i].id,
            },
            data: {
              data_aluguel: null,
              data_expiracao: null,
              status_aluguel: "Disponivel",
              dias_alugados: 0,
              tipo: "Aluguel",
              pedidoId: null,
            }
          })

          await prisma.produto.update({
            where: {
              id: pedido.alugueis[i].produto.id
            },
            data: {
              quantidadeEmEstoque: {
                increment: 1
              }
            }
          })
        }

      }
      if(pedido.vendas.length > 0){
        for(let i = 0; i < pedido.vendas.length ; i++) {
          await prisma.venda.update({
            where: {
              id: pedido.vendas[i].id,
            },
            data: {
              status_venda: "Disponivel",
              pedidoId: null,
            }
          })

          await prisma.produto.update({
            where: {
              id: pedido.vendas[i].produto.id
            },
            data: {
              quantidadeEmEstoque: {
                increment: 1
              }
            }
          })
        }
      }

      const pagamento = await prisma.pagamento.findUnique({
        where: {
          pedidoId: Number(id)
        },
        include:{
          boleto: true,
          cartao: true
        }
      })

      if(pagamento){      
        if(pagamento.boleto){
          await prisma.boleto.delete({
            where: {
              id: pagamento.boleto.id
            }
          })
        }
        if(pagamento.cartao){
          await prisma.cartao.delete({
            where: {
              id: pagamento.cartao.id
            }
          })
        }
        
        await prisma.pagamento.delete({
          where: {
            pedidoId: Number(id)
          }
        })
      }
          
      await prisma.pedido.delete({
        where: {
          id: Number(id)
        }
      })

      return res.status(200).json({message: "Pedido cancelado com sucesso"})
    }else{
      return res.status(404).json({message: "Nenhum pedido encontrado"})
    }
  }

  async atualizarEnvio(req: Request, res:  Response){
    const id = Number(req.params.id)
    const today = new Date()
    const {codigo_rastreio} = req.body

    const pedido = await prisma.pedido.update({
      where: {
        id: id
      },
      data: {
        status: "Enviado",
        data_envio: today,
        codigo_rastreio: codigo_rastreio
      }
    })    
    if(pedido){
      return res.status(200).json({message: "Pedido marcado como enviado com sucesso"})
    }else{
      return res.status(404).json({message: "Nenhum pedido encontrado"})
    }
  }

  async alterarEndereco(req: Request, res: Response){
  }

  async capturarPagamento(req: Request, res: Response){
    const { orderID } = req.body;
    const captureData = await capturePayment(orderID);

    const paypalInfo = await prisma.paypal.findFirst({
      where: {
        id: orderID
      }
    })
    await prisma.paypal.update({
      where: {
        id: orderID
      },
      data: {
        status: "Pago"
      }
    })
    await prisma.pagamento.update({
      where: {
        id: paypalInfo?.pagamentoId
      },
      data: {
        status: "Pago",
        data_pagamento: new Date()
      }
    }).then(async (pagamento) => {
      await prisma.pedido.update({
        where: {
          id: pagamento?.pedidoId
        },
        data: {
          status: "Aguardando Envio"
        }
      })
      //TODO: create update for alugueis too
      await prisma.venda.updateMany({
        where: {
          pedidoId: pagamento?.pedidoId
        },
        data: {
          status_venda: "Vendido"
        }
      })
    })

    res.json(captureData);
  }
}


async function capturePayment(orderId: any) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

async function createOrder(value: any) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "BRL",
            value: value,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  return data;
}


async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
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
