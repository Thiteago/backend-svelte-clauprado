import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import glob from 'glob'


export class ProdutoController{
    async cadastrar (req: Request, res: Response){
        let resultStatus = 201
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
            dataCriacao,    
            dataPublicacao,  
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
        
        if(checkNome == null){
            await prisma.produto.create({
                data:{
                    nome,           
                    descricao,      
                    dataCriacao,    
                    dataPublicacao,  
                    tipo,           
                    valor: parseFloat(valor),    
                    altura,         
                    largura,        
                    comprimento,    
                    material ,
                    categoria,
                    imagens: ids,
                    peso
                },
            }).then((result) => {
                resultStatus = 201
            })
        }else{
            resultStatus = 500
        }

        res.sendStatus(resultStatus)
    }
    
    async listar (req: Request, res: Response){
        const produtos = await prisma.produto.findMany({
            where:{
                quantidadeEmEstoque: {
                    gt: 0
                }
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

        const {
            nome,
            descricao,
            dataCriacao,
            tipo,
            valor,
            altura,
            largura,
            comprimento,
            material,
            categoria
        } = req.body
    

        const checkNome = await prisma.produto.findFirst({
            where:{
              nome: nome
            }
        })


        if(checkNome?.nome == null || checkNome.id == idProduto){
            if(myfiles.length > 0){
                await prisma.produto.update({
                    where:{
                    id: idProduto
                    },
                    data:{
                        nome,
                        descricao,
                        dataCriacao,
                        tipo,
                        valor: parseFloat(valor),
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
							await prisma.produto.update({
								where:{
								id: idProduto
								},
								data:{
										nome,
										descricao,
										dataCriacao,
										tipo,
										valor: parseFloat(valor),
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