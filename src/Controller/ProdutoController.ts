import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import glob from 'glob'


export class ProdutoController{
  async cadastrar (req: Request, res: Response){
    let ids: Array<string> = [];
    var myfiles = JSON.parse(JSON.stringify(req.files))
    
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
            Venda: {
              create: {
                tipo: "Venda",
                status_venda: "Disponível"
              }
            }
          },
        }).then(() => {
          res.sendStatus(201)
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
            Aluguel: {
              create: {
                data_disponibilidade: data_disponibilidade,
                status_aluguel: "Disponível",
                dias_alugados: 0,
                tipo: "Aluguel"
              }
            }
          }
        }).then(() => {
          res.sendStatus(201)
        })
      }
    }else{
      res.sendStatus(500)
    }
  }
    
  async listar (req: Request, res: Response){
    let produtos = await prisma.produto.findMany({
      include:{
        Venda: true,
        Aluguel: true,
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
      dataCriacao,     
      quantidade,
      tipo,
      dataDisponibilidade,
      dataExpiracao,        
      status_aluguel,   
      valor,          
      altura,         
      largura,        
      comprimento,    
      material,
      categoria,   
      peso  
    } = req.body
    peso = parseFloat(peso)
  

    const checkNomeVenda = await prisma.produtoVenda.findFirst({
      where:{
        nome: nome
      }
    })

    const checkNomeAluguel = await prisma.produtoAluguel.findFirst({
        where:{
            nome: nome
        }
    })

    if(tipo != "Aluguel"){
        if(checkNomeVenda?.nome == null || checkNomeVenda.id == idProduto){
            if(myfiles.length > 0){
                await prisma.produtoVenda.update({
                    where:{
                    id: idProduto
                    },
                    data:{
                        nome,
                        descricao,
                        dataCriacao,
                        valor: parseFloat(valor),
                        quantidadeEmEstoque: parseInt(quantidade),
                        altura,
                        largura,
                        comprimento,
                        material,
                        categoria,
                        imagens : ids
                    }
                })
                return res.sendStatus(201)
            }else{
                await prisma.produtoVenda.update({
                    where:{
                    id: idProduto
                    },
                    data:{
                        nome,
                        descricao,
                        dataCriacao,
                        valor: parseFloat(valor),
                        quantidadeEmEstoque: parseInt(quantidade),
                        altura,
                        largura,
                        comprimento,
                        material,
                        categoria
                    }
                })
                return res.sendStatus(201)
            }
        }
    }else{
      if(checkNomeAluguel?.nome == null || checkNomeAluguel.id == idProduto){
          if(myfiles.length > 0){
              await prisma.produtoAluguel.update({
                  where:{
                  id: idProduto
                  },
                  data:{
                      nome,
                      descricao,
                      dataCriacao,
                      data_disponibilidade: new Date(dataDisponibilidade),
                      data_expiracao: new Date(dataExpiracao),
                      status_aluguel: status_aluguel,
                      valor: parseFloat(valor),
                      quantidadeEmEstoque: parseInt(quantidade),
                      peso,
                      altura,
                      largura,
                      comprimento,
                      material,
                      categoria,
                      imagens : ids
                  }
              })
              return res.sendStatus(201)
          }else{
              await prisma.produtoAluguel.update({
                  where:{
                  id: idProduto
                  },
                  data:{
                    nome,
                    descricao,
                    dataCriacao,
                    data_disponibilidade: new Date(dataDisponibilidade),
                    data_expiracao: new Date(dataExpiracao),
                    status_aluguel: status_aluguel,
                    valor: parseFloat(valor),
                    quantidadeEmEstoque: parseInt(quantidade),
                    peso,
                    altura,
                    largura,
                    comprimento,
                    material,
                    categoria
                  }
              })
              return res.sendStatus(201)
          }
      }else{
    return res.sendStatus(500)
    }
  }
}

  async excluir (req: Request, res: Response){
      const idProduto = Number(req.params.id)

      await prisma.produto.delete({
          where:{
          id: idProduto
          }
      })

      res.sendStatus(201)
  }

  async listarpeloid (req: Request, res: Response){
    const idProduto = Number(req.params.id)
    const produto = await prisma.produto.findUnique({
        where: {
          id: idProduto
        },
        include: {
          Venda: true,
          Aluguel: true,
          promocao: true
        }
    })
    return res.json(produto)
  }

  async enviarPath (req: Request, res: Response){
    const idProduto = Number(req.params.id)
    const imagens: string[] = []
    var caminhos: string[] = []

    const query = await prisma.produto.findMany({
      where:{
        id: idProduto
      }
    })
    

    query.map((item) => {
        item.imagens.map((element) => {
            imagens.push(element)
        })
    })

    
    glob("public/uploads/*.jpg", function (er, files) : any {

        imagens.map((element) => {
            files.map((item) => {
                if(item.includes(element)){
                    caminhos.push(item)
                }
            })
        })
    })

    glob("public/uploads/*.jpeg", function (er, files) {
        imagens.map((element) => {
            files.map((item) => {
                if(item.includes(element)){
                    caminhos.push(item)
                }
            })
        })
    })

    glob("public/uploads/*.png", function (er, files) {
        imagens.map((element) => {
            files.map((item) => {
                if(item.includes(element)){
                    caminhos.push(item)
                }
            })
        })

        caminhos.map((item, i) => {
            caminhos[i] = item.replace('public/uploads/', '')
        })

        res.json({caminhos})
    })
  }
}