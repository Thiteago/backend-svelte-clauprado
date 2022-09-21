import { Request, Response } from "express";
import { prisma } from "../utils/prisma";


export class ProdutoController{
    async cadastrar (req: Request, res: Response){
        let resultStatus = 0
        const id = req.file?.filename.split('_', 1)
        const file = req.file
        console.log(file)

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
                imagens: id
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
}