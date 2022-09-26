import { Request, Response } from "express";
import { prisma } from "../utils/prisma";


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
        })
        .then((result) => {
            resultStatus = 201
        }).catch((error) =>{
            console.log(error)
            resultStatus = 500
        })

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




        if(checkNome?.nome != null ){
            if(checkNome.nome == nome && checkNome.id == idProduto){
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
            }
            return res.sendStatus(400)
        }

        
    }
}