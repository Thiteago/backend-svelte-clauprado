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
         cep,
         numeroTel,
         numeroCel,
         cargo
    } = req.body;

    const userExists = await prisma.user.findUnique({where: {email}})

    if(userExists){
        return res.json({error: "User already exists"})
    }


    const hash_password = await hash(senha, 8)
    
    const user = await prisma.user.create({
      data: {
        nome,
        dataNascimento,
        email,
        senha: hash_password,
         cpf,
         rua,
         numeroRua,
        bairro,
         cidade,
         cep,
         numeroTel,
         numeroCel,
         cargo: "Usuario"
      },
    });

    res.sendStatus(201)
    return res.json({user})
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

    const updateUser = await prisma.user.update({
      where:{
        id: idPerson
      },
      data:{
        email: email,
        numeroCel: numeroCel
      }
    })

    return res.sendStatus(201)
  }
}
