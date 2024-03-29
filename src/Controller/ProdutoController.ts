import { Request, Response } from "express";
import { prisma } from "../utils/prisma";


export class ProdutoController{
  async cadastrar (req: Request, res: Response){
    let ids: Array<string> = [];
    var myfiles = JSON.parse(JSON.stringify(req.files))
    
    myfiles.map((item: any) => {
      ids.push(item.filename)
    })

    let {
      nome,           
      descricao,      
      dataFabricacao,    
      quantidade,
      peso,
      valor,
      data_disponibilidade,
      altura, 
      categoria,
      largura, 
      comprimento, 
      material,
      personalizaveis,
      tipo,
    } = req.body
    peso = parseFloat(peso)
    valor = parseFloat(valor)


    const checkNomeProduto = await prisma.produto.findFirst({
      where:{
        nome: nome
      }
    })
    if(checkNomeProduto == null){
      if(tipo != "Aluguel"){
        await prisma.produto.create({
          data:{
            nome,           
            descricao,      
            dataFabricacao: new Date(dataFabricacao),    
            quantidadeEmEstoque: parseInt(quantidade),        
            valor: parseFloat(valor),    
            altura,         
            largura,        
            comprimento,    
            material ,
            imagens: ids,
            peso,
            tipo,

            Categorias: {
              connect: {
                id: Number(categoria)
              }
            },
            
            statisticProduct : {
              create: {
                totalLucro: 0,
              }
            }
          },
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            let venda_criada = await prisma.venda.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Venda",
                status_venda: "Disponivel"
              }
            })


            if(Array.isArray(personalizaveis)){
              for(let i = 0; i< personalizaveis.length; i++){
                await prisma.produto_mudanca.create({
                  data:{
                    nome: personalizaveis[i],
                    vendaId: venda_criada.id
                  }
                })
              }
            }
          }
   
          res.status(201).json('Sucesso')
        })
      }else{
        await prisma.produto.create({
          data:{
            nome,           
            descricao,      
            dataFabricacao: new Date(dataFabricacao),    
            quantidadeEmEstoque: parseInt(quantidade),        
            valor: parseFloat(valor),    
            altura,         
            largura,        
            comprimento,    
            material ,
            imagens: ids,
            peso,
            tipo,

            Categorias: {
              connect: {
                id: Number(categoria)
              }
            },
            

            statisticProduct : {
              create: {
                totalLucro: 0,
              }
            }
          }
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            let aluguel_criado = await prisma.aluguel.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Aluguel",
                data_disponibilidade,
                status_aluguel: 'Disponivel',
              }
            })

            if(Array.isArray(personalizaveis)){
              for(let i = 0; i< personalizaveis.length; i++){
                await prisma.produto_mudanca.create({
                  data:{
                    nome: personalizaveis[i],
                    aluguelId: aluguel_criado.id
                  }
                })
              }
            }
          }

          
          res.status(201).json('Sucesso')
        })
      }
    }else{
      return res.status(409).json('Sucesso')
    }
  }

  async marcarVisualizacao (req: Request, res: Response){
    let idProduto = Number(req.params.id)

    await prisma.statisticProduct.update({
      where:{
        produtoId: idProduto
      },
      data:{
        qtdeVisualizada: {
          increment: 1
        }
      }
    })
  }
    
  async listar (req: Request, res: Response){
    let produtos: any = await prisma.produto.findMany({
      where:{
        status: "Ativo"
      },
      include:{
        Venda: {
          where:{
            status_venda: "Disponivel"
          },
          include:{
            produto_mudanca: true
          }
        },
        Aluguel: {
          where:{
            status_aluguel: "Disponivel"
          },
          include:{
            produto_mudanca: true
          }
        },
        promocao: true,
        Categorias: true,
      }
    })

    return res.json(produtos)
  }

  async alterar (req: Request, res: Response){
    const idProduto = Number(req.params.id)
    let ids: Array<string> = [];
    let myfiles = JSON.parse(JSON.stringify(req.files))
    let diferenca
      
    myfiles.map((item: any) => {
      ids.push(item.filename)
    })

    let {
      nome,           
      descricao,      
      dataFabricacao,     
      quantidade,
      tipo,
      valor,          
      altura,         
      largura,        
      comprimento,    
      material,
      personalizaveis,
      categoria,   
      peso  
    } = req.body
    peso = parseFloat(peso)

    const checkNome = await prisma.produto.findFirst({
      where:{
        nome: nome
      }
    })

    const oldProduct = await prisma.produto.findUnique({
      where: {
        id: idProduto
      },
      include:{
        Aluguel: {
          include:{
            produto_mudanca: true
          }
        },
        Venda: {
          include:{
            produto_mudanca: true
          }
        },
      }
    })

    if(checkNome?.nome != null){
      if(checkNome.id != idProduto){
        return res.status(500).send('Este nome ja existe!')
      }
    }
    const updateData: any = {
      nome,
      descricao,
      dataFabricacao: new Date(dataFabricacao),
      valor: parseFloat(valor),
      quantidadeEmEstoque: parseInt(quantidade),
      peso,
      altura,
      largura,
      comprimento,
      material,
      categoriasId: Number(categoria)
      
    };

    if (ids.length > 0) {
      updateData.imagens = ids;
    }
    
    try {
      await prisma.produto.update({
        where: { id: idProduto },
        data: updateData,

      });
      if(tipo == 'Aluguel' && oldProduct){
        if(quantidade > 0 && quantidade > oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo == 'Aluguel'){
            diferenca = quantidade - oldProduct.quantidadeEmEstoque
            for(let i = 0; i < diferenca; i++) {
              await prisma.aluguel.create({
                data:{
                  data_disponibilidade: new Date(),
                  status_aluguel: 'Disponivel',
                  tipo: 'Aluguel',
                  produtoId: idProduto
                }
              })
            }
            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }else if(oldProduct.tipo == 'Venda'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto
                }
              })
              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.aluguel.create({
                data:{
                  data_disponibilidade: new Date(),
                  status_aluguel: 'Disponivel',
                  tipo: 'Aluguel',
                  produtoId: idProduto
                }
              })
            }
            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
                tipo: 'Aluguel'
              },
            });
          }
        }else if(quantidade > 0 && quantidade < oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo == 'Aluguel'){
            diferenca = oldProduct.quantidadeEmEstoque - quantidade
            for(let i = 0; i < diferenca; i++) {
              let willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto,
                  status_aluguel: 'Disponivel'
                }
              })
              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }else if(oldProduct.tipo == 'Venda'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto,
                  status_venda: 'Disponivel'
                }
              })
              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.aluguel.create({
                data:{
                  data_disponibilidade: new Date(),
                  status_aluguel: 'Disponivel',
                  tipo: 'Aluguel',
                  produtoId: idProduto
                }
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }
        }else if(quantidade == 0){
          if(oldProduct.tipo == 'Aluguel'){
            for(let i = 0; i < oldProduct.Aluguel.length; i++) {
              let willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto,
                  status_aluguel: 'Disponivel'
                }
              })
              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }else if(oldProduct.tipo == 'Venda'){
            for(let i = 0; i < oldProduct.Venda.length; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto,
                  status_venda: 'Disponivel'
                }
              })
              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }
        }else if (quantidade == oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo != 'Aluguel'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto,
                  status_venda: 'Disponivel'
                }
              })
              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.aluguel.create({
                data:{
                  data_disponibilidade: new Date(),
                  status_aluguel: 'Disponivel',
                  tipo: 'Aluguel',
                  produtoId: idProduto
                }
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
                tipo: 'Aluguel'
              },
            });
          }
        }
        if(Array.isArray(personalizaveis)){
          for (let i = 0; i < oldProduct.Aluguel.length; i++) {
            await prisma.produto_mudanca.deleteMany({
              where: {
                aluguelId: oldProduct.Aluguel[i].id,
                NOT: {
                  nome: {
                    in: personalizaveis
                  }
                }
              }
            });
          }

          for (let i = 0; i < oldProduct.Aluguel.length; i++) {
            const produto = oldProduct.Aluguel[i];
          
            for (const value of personalizaveis) {
              if (!produto.produto_mudanca.some(item => item.nome === value)) {
                await prisma.produto_mudanca.create({
                  data: {
                    aluguelId: produto.id,
                    nome: value,
                  }
                });
              }
            }
          }
        }
        return res.status(201).json('Sucesso');
      }else if(tipo == 'Venda' && oldProduct){
        if(quantidade > 0 && quantidade > oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo == 'Aluguel'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto
                }
              })

              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.venda.create({
                data:{
                  status_venda: 'Disponivel',
                  tipo: 'Venda',
                  produtoId: idProduto
                }
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
                tipo: 'Venda'
              },
            });
          }else if(oldProduct.tipo == 'Venda'){
            diferenca = quantidade - oldProduct.quantidadeEmEstoque
            for(let i = 0; i < diferenca; i++) {
              await prisma.venda.create({
                data:{
                  status_venda: 'Disponivel',
                  tipo: 'Venda',
                  produtoId: idProduto
                }
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }
        }else if(quantidade > 0 && quantidade < oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo == 'Aluguel'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let  willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto
                }
              })

              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.venda.create({
                data:{
                  status_venda: 'Disponivel',
                  tipo: 'Venda',
                  produtoId: idProduto
                }
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
                tipo: 'Venda'
              },
            });
          }else if(oldProduct.tipo == 'Venda'){
            diferenca = oldProduct.quantidadeEmEstoque - quantidade
            for(let i = 0; i < diferenca; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto,
                  status_venda: 'Disponivel'
                }
              })
              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }

            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
              },
            });
          }
        }else if(quantidade == 0){
          if(oldProduct.tipo == 'Aluguel'){
            for(let i = 0; i < oldProduct.Aluguel.length; i++) {
              let willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto,
                  status_aluguel: 'Disponivel'
                }
              })  
              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
          }else if(oldProduct.tipo == 'Venda'){
            for(let i = 0; i < oldProduct.Venda.length; i++) {
              let willDeleted = await prisma.venda.findFirst({
                where:{
                  produtoId: idProduto,
                  status_venda: 'Disponivel'
                }
              })

              await prisma.venda.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
          }
          await prisma.produto.update({
            where: { id: idProduto },
            data: {
              quantidadeEmEstoque: parseInt(quantidade),
              tipo: 'Venda'
            },
          });
        }else if (quantidade == oldProduct.quantidadeEmEstoque){
          if(oldProduct.tipo != 'Venda'){
            for(let i = 0; i < oldProduct.quantidadeEmEstoque; i++) {
              let willDeleted = await prisma.aluguel.findFirst({
                where:{
                  produtoId: idProduto,
                  status_aluguel: 'Disponivel'
                }
              })
              await prisma.aluguel.delete({
                where: {
                  id: willDeleted?.id
                },
              })
            }
            for(let i = 0; i < parseInt(quantidade); i++) {
              await prisma.venda.create({
                data:{
                  status_venda: 'Disponivel',
                  produtoId: idProduto
                }
              })
            }
            await prisma.produto.update({
              where: { id: idProduto },
              data: {
                quantidadeEmEstoque: parseInt(quantidade),
                tipo: 'Venda'
              },
            });
          }
        }
        
        
        if(Array.isArray(personalizaveis)){
          for(let i = 0; i< oldProduct.Venda.length; i++){
            for(let j = 0; j < personalizaveis.length; j++){
              await prisma.produto_mudanca.update({
                where:{
                  id: oldProduct.Venda[i].produto_mudanca[j].id
                },
                data:{
                  nome: personalizaveis[j].nome,
                }
              })
            }
          }
        }
        return res.status(201).json('Sucesso');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json('Sucesso');
    }
  }

  async excluir (req: Request, res: Response){
      const idProduto = Number(req.params.id)

      await prisma.venda.deleteMany({
        where: {
          produtoId: idProduto,
          status_venda: 'Disponivel'
        }
      })
      const produto = await prisma.produto.findFirst({
        where: {
          id: idProduto
        },
        include:{
          Aluguel: true,
          Venda: true
        }
      })

      if(produto){
        if(produto.Aluguel.length > 0){
          for(let i = 0; i < produto.Aluguel.length; i++){
            try{
              await prisma.produto_mudanca.deleteMany({
                where: {
                  aluguelId: produto.Aluguel[i].id 
                }
              })
            }catch(e){
              console.error('failed to delete produto_mudanca')
            }
          }
        }else if(produto.Venda.length > 0){
          for(let i = 0; i < produto.Venda.length; i++){
            try{
              await prisma.produto_mudanca.deleteMany({
                where:{
                  vendaId: produto.Venda[i].id
                }
              })
            }catch(e){
              console.error('failed to delete produto_mudanca')
            }
          }
        }
      }

      await prisma.aluguel.deleteMany({
        where: {
          produtoId: idProduto,
          status_aluguel: 'Disponivel'
        }
      })


      await prisma.produto.update({
        where: { id: idProduto },
        data: {
          status: 'Inativo',
        },
      })

      res.status(201).json('Sucesso')
  }

  async listarpeloid (req: Request, res: Response){
    const idProduto = Number(req.params.id)
    let produto:  any = await prisma.produto.findUnique({
        where: {
          id: idProduto
        },
        include: {
          Venda: {
            where: {
              status_venda: 'Disponivel'
            },
            include: {
              produto_mudanca: true,
            }
          },
          Aluguel: {
            where: {
              status_aluguel: 'Disponivel'
            },
            include: {
              produto_mudanca: true,
            }
          },
          Categorias: true,
          promocao: true,
        }
    })
  
    return res.json(produto)
  }
}
