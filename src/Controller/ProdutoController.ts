import { Request, Response } from "express";
import { prisma } from "../utils/prisma";


export class ProdutoController{
    async cadastrar (req: Request, res: Response){
        let resultStatus = 0

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
            categoria       
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
                categoria
            },
        })
        .then((result) => {
            resultStatus = 201
        }).catch((error) =>{
            resultStatus = 500
        })

        res.sendStatus(resultStatus)
    }

    async inserirImagem(req: Request, res: Response){{
        console.log(req.files)

        res.status(201)
        return res.json(req.file?.filename)
    }}
}