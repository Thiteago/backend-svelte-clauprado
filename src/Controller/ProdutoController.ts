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
}