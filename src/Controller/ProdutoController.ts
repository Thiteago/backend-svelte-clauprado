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


        const {
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
        } = req.body

        const checkNome = await prisma.produto.findFirst({
            where:{
              nome: nome
            }
        })
        
        if(checkNome == null){
            const produto = await prisma.produto.create({
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
                    imagens: ids
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
        const produtos = await prisma.produto.findMany()
        return res.json({produtos})
    }

    async alterar (req: Request, res: Response){
        const idProduto = Number(req.params.id)

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
            categoria,
            imagens
        } = req.body

        const checkNome = await prisma.produto.findFirst({
            where:{
              nome: nome
            }
        })


        if(checkNome?.nome == null || checkNome.id == idProduto){
            const updateUser = await prisma.produto.update({
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
                    imagens
                }
            })
            return res.sendStatus(201)
        }else{
            return res.sendStatus(400)
        }
    }

    async excluir (req: Request, res: Response){
        const idProduto = Number(req.params.id)

        const deleteProduto = await prisma.produto.delete({
            where:{
                id: idProduto
            }
        })

        res.sendStatus(201)
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