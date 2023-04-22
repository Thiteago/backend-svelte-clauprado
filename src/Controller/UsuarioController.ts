import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class UsuarioController {
  async cadastrar(req: Request, res: Response) {
    const {
      nome,
      dataNascimento,
      email,
      senha,
      cpf,
      rua,
      numeroRua,
      bairro,
      cidade,
      estado,
      cep,
      numeroTel,
      numeroCel,
      endereco
    } = req.body; 

    const emailExists = await prisma.user.findUnique({
      where: { email },
    })
    const cpfExists = await prisma.user.findUnique({where: {cpf}})

    if(emailExists || cpfExists){
      return res.status(401).json({message: "User Already Exists!"})
    }
    const hash_password = await hash(senha, 8)
    const user = await prisma.user.create({
      data: {
        nome,
        dataNascimento,
        email,
        senha: hash_password,
        cpf,
        numeroTel,
        numeroCel,
        cargo: "Usuario",
      },
    }).then(async (user) => {
      if(endereco?.length > 0){
        for(let i = 0; i < endereco.length; i++){
          if(endereco[i].principal == true){
            await prisma.endereco.create({
              data: {
                rua: endereco[i].rua,
                numeroRua: endereco[i].numeroRua,
                bairro: endereco[i].bairro,
                cidade: endereco[i].cidade,
                estado: endereco[i].estado,
                cep: endereco[i].cep,
                principal: endereco[i].principal,
                userId: user.id
              }
            })
          }else{
            await prisma.endereco.create({
              data: {
                rua: endereco[i].rua,
                numeroRua: endereco[i].numeroRua,
                bairro: endereco[i].bairro,
                cidade: endereco[i].cidade,
                estado: endereco[i].estado,
                cep: endereco[i].cep,
                userId: user.id
              }
            })
          }
        }
      }else{
        await prisma.endereco.create({
          data: {
            rua,
            numeroRua: numeroRua.toString(),
            bairro,
            cidade,
            estado,
            cep,
            principal: true,
            userId: user.id
          }
        })
      }
    })

    return res.status(201).json({user})
  }

  async listar(req: Request, res: Response){
    const users = await prisma.user.findMany();
    return res.json(users )
  }

  async mostrarInfo(req: Request, res: Response){
    const idPerson = Number(req.params.id)

    const getUser = await prisma.user.findUnique({
      where: {
        id: idPerson,
      },
    })

    return res.json(getUser)
  }

  async alterarUser(req: Request, res: Response){
    const idPerson = Number(req.params.id)
    const{email, numeroCel} = req.body

    const userExists = await prisma.user.findUnique({where: {email}})

    if(userExists?.id == idPerson){
      if(userExists.numeroCel != numeroCel){
        await prisma.user.update({
          where: {
            id: idPerson
          },
          data:{
            numeroCel: numeroCel
          }
        })
        return res.status(201).json({message: 'Alterado com sucesso'})
      }else if(userExists.email != email){
        await prisma.user.update({
          where:{
            id: idPerson
          },
          data:{
            email: email
          }
        })
        res.status(201)
      }
    }else{
      return res.status(401).json({error: "Email ja esta sendo utilizado por outro usuário"})
    }
  }

  async listarEnderecos(req: Request, res: Response){
    const idPerson = Number(req.params.id)

    const enderecos = await prisma.endereco.findMany({
      where: {
        userId: idPerson
      }
    })

    return res.json(enderecos)
  }

  async cadastrarNovoEndereco(req: Request, res: Response){
    const idPerson = Number(req.params.id)
    let novoEndereco = null

    const {rua, numeroRua, bairro, cidade, estado, cep, principal, endereco} = req.body

    if(principal == true){
      await prisma.endereco.updateMany({
        where: {
          userId: idPerson
        },
        data:{
          principal: false
        }
      })
    }
    
    if(endereco){
      novoEndereco = await prisma.endereco.create({
        data: {
          rua: endereco.rua,
          numeroRua: endereco.numeroRua,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
          cep: endereco.cep,
          principal: false,
          
          user: {
            connect: {
              id: idPerson
            }
          }
        }
      })
    }else{
      novoEndereco = await prisma.endereco.create({
        data: {
          rua,
          numeroRua,
          bairro,
          cidade,
          estado,
          cep,
          principal: principal,
          userId: idPerson
        }
      })
    }

    if(novoEndereco){
      return res.status(201).json({message: "Endereço cadastrado com sucesso"})
    }else{
      return res.status(401).json({error: "Erro ao cadastrar endereço"})
    }
  }

  async atualizarEndereco(req: Request, res: Response){
    const idPerson = Number(req.params.id)
    const {rua, numeroRua, bairro, cidade, estado, cep, principal, idEndereco} = req.body
    let endereco = null

    if(principal == true){
      await prisma.endereco.updateMany({
        where: {
          userId: idPerson
        },
        data:{
          principal: false
        }
      })
      
      endereco = await prisma.endereco.update({
        where: {
          id: idEndereco
        },
        data:{
          rua,
          numeroRua,
          bairro,
          cidade,
          estado,
          cep,
          principal: principal
        }
      })
    }else{
      endereco = await prisma.endereco.update({
        where: {
          id: idEndereco
        },
        data:{
          rua,
          numeroRua,
          bairro,
          cidade,
          estado,
          cep,
          principal: principal
        }
      })
    }

    if(endereco != null){
      return res.status(201).json({message: "Endereço atualizado com sucesso"})
    }else{
      return res.status(401).json({error: "Erro ao atualizar endereço"})
    }
  }

  async atualizarCargo(req: Request, res: Response){
    const idPerson = Number(req.params.id)
    const {cargo} = req.body

    const userExists = await prisma.user.findUnique({
      where: {
        id: idPerson
      }
    })
    if(userExists){
      const user = await prisma.user.update({
        where: {
          id: idPerson
        },
        data:{
          cargo: cargo
        }
      })
      

      if(user){
        return res.status(201).json({message: "Cargo atualizado com sucesso"})
      }else{
        return res.status(401).json({error: "Erro ao atualizar cargo"})
      }
    }else{
      return res.status(401).json({error: "Usuario não encontrado"})
    }
  }

  async registrarVisita(req: Request, res: Response){
    let logado = req.params
    if(logado){
    await prisma.visit.create({
      data:{
        date: new Date(),
        logado: true,
      }
    })
    }else{
      await prisma.visit.create({
        data:{
          date: new Date(),
          logado: false,
        }
      })
    }
    return res.status(201).json({message: "Visita registrada com sucesso"})
  }
}
