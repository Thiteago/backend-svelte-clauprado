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

        enderecos: {
          create: {
            rua,
            numeroRua,
            bairro,
            cidade,
            cep,
            estado,
            principal: true
          }
        }
      },
    });

    return res.status(201).json({user})
  }

  async listar(req: Request, res: Response){
    const users = await prisma.user.findMany();
    return res.json({users})
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

    const {rua, numeroRua, bairro, cidade, estado, cep, principal} = req.body

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

    const endereco = await prisma.endereco.create({
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

    if(endereco){
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
}
