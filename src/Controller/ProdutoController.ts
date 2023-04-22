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
      largura, 
      comprimento, 
      material,
      categoria, 
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
            categoria,
            imagens: ids,
            peso,

            statisticProduct : {
              create: {
                totalLucro: 0,
              }
            }
          },
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.venda.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Venda",
                status_venda: "Disponivel"
              }
            })
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
            categoria,
            imagens: ids,
            peso,

            statisticProduct : {
              create: {
                totalLucro: 0,
              }
            }
          }
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.aluguel.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Aluguel",
                data_disponibilidade,
                status_aluguel: 'Disponivel',
              }
            })
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
      include:{
        Venda: {
          where:{
            status_venda: "Disponivel"
          }
        },
        Aluguel: {
          where:{
            status_aluguel: "Disponivel"
          }
        },
        promocao: true
      }
    })

    return res.json(produtos)
  }

  async alterar (req: Request, res: Response){
    const idProduto = Number(req.params.id)
    let ids: Array<string> = [];
    let myfiles = JSON.parse(JSON.stringify(req.files))
      
    myfiles.map((item: any) => {
      ids.push(item.filename)
    })

    for(var i = 0; i< ids.length; i++){
      ids[i] = ids[i].split('_',1)[0]
    }

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
        Aluguel: true,
        Venda: true,
      }
    })

    if(checkNome?.nome != null){
      if(checkNome.id != idProduto){
        return res.status(500).send('Este nome ja existe!')
      }
    }
    
    const updateData: any = {
      nome,
      categoria,
      descricao,
      dataFabricacao: new Date(dataFabricacao),
      valor: parseFloat(valor),
      quantidadeEmEstoque: parseInt(quantidade),
      peso,
      altura,
      largura,
      comprimento,
      material,
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
        console.log(oldProduct)
        if(oldProduct.Aluguel.length > 0 && oldProduct.quantidadeEmEstoque == 0 && quantidade > 0){
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
        }else if(oldProduct.Aluguel.length == 0 && oldProduct.Venda.length > 0){
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.venda.delete({
              where: {
                id: oldProduct.Venda[i].id
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
        }
      }else if(tipo == 'Venda' && oldProduct){
        if(oldProduct.Venda.length > 0 && oldProduct.quantidadeEmEstoque == 0 && quantidade > 0){
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.venda.create({
              data:{
                status_venda: 'Disponivel',
                tipo: 'Venda',

                produtoId: idProduto
              }
            })
          }
        }else if(oldProduct.Venda.length == 0 && oldProduct.Aluguel.length > 0){
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.aluguel.delete({
              where: {
                id: oldProduct.Aluguel[i].id
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
        }
      }
      return res.status(201).json('Sucesso');
    } catch (error) {
      console.error(error);
      return res.status(500).json('Sucesso');
    }
  }

  async excluir (req: Request, res: Response){
      const idProduto = Number(req.params.id)

      await prisma.venda.deleteMany({
        where:{
          produtoId: idProduto
        }
      })

      await prisma.aluguel.deleteMany({
        where:{
          produtoId: idProduto
        }
      })

      await prisma.produto.delete({
        where:{
          id: idProduto
        }
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
            }
          },
          Aluguel: {
            where: {
              status_aluguel: 'Disponivel'
            }
          },
          promocao: true
        }
    })
  
    return res.json(produto)
  }
}
