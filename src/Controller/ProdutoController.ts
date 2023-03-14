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
            peso
          },
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.venda.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Venda",
                status_venda: "Disponível"
              }
            })
          }
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
          }
        }).then(async (produtoCriado: any) => {
          for(let i = 0; i < parseInt(quantidade); i++) {
            await prisma.aluguel.create({
              data: {
                produtoId: produtoCriado.id,
                tipo: "Aluguel",
                data_disponibilidade,
                status_aluguel: 'Disponível',
              }
            })
          }
          res.sendStatus(201)
        })
      }
    }else{
      res.sendStatus(500)
    }
  }
    
  async listar (req: Request, res: Response){
    let produtos: any = await prisma.produto.findMany({
      include:{
        Venda: {
          where: {
            status_venda: 'Disponível'
          }
        },
        Aluguel: {
          where: {
            status_aluguel: 'Disponível'
          }
        },
        promocao: true
      }
    })

    produtos = produtos.map(async(produto: any) => {
      produto = {...produto, caminhos: await enviarPath(produto.id)}
      return produto
    })
    
    produtos = await Promise.all(produtos)
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
    console.log(dataFabricacao)
  

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

     
      if(tipo == 'Aluguel'){
        if(oldProduct?.Aluguel != null && oldProduct.quantidadeEmEstoque == 0 && quantidade > 0){
          await prisma.aluguel.update({
            where:{
              id: oldProduct.Aluguel.id
            },
            data:{
              status_aluguel: 'Disponível'
            }
          })
        }else if(oldProduct?.Aluguel == null && oldProduct?.Venda != null){
          
        }
      }

      return res.sendStatus(201);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
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
    let produto:  any = await prisma.produto.findUnique({
        where: {
          id: idProduto
        },
        include: {
          Venda: {
            where: {
              status_venda: 'Disponível'
            }
          },
          Aluguel: {
            where: {
              status_aluguel: 'Disponível'
            }
          },
          promocao: true
        }
    })

    produto = {...produto, caminhos: await enviarPath(produto.id)}
  
    return res.json(produto)
  }
}

async function enviarPath(id: any) {
  const imagens: string[] = [];
  const caminhos: any[] = [];

  const query = await prisma.produto.findMany({
    where: {
      id: id,
    },
  });

  query.forEach((item) => {
    item.imagens.forEach((element) => {
      imagens.push(element);
    });
  });

  const extensions = ["jpg", "jpeg", "png"];
  const promises: any[] = [];

  extensions.forEach((extension) => {
    promises.push(
      new Promise<void>((resolve, reject) => {
        glob(`public/uploads/*.${extension}`, (err, files) => {
          if (err) reject(err);

          imagens.forEach((element) => {
            files.forEach((item) => {
              if (item.includes(element)) {
                caminhos.push(item);
              }
            });
          });

          resolve();
        });
      })
    );
  });

  await Promise.all(promises);

  caminhos.forEach((item, i) => {
    caminhos[i] = item.replace("public/uploads/", "");
  });

  return caminhos;
}