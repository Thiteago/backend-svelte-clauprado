import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export class AuthController {
  async authenticate(req: Request, res: Response) {
    const {
        email,
        senha
    } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            senha: true,
            cargo: true,
            nome: true
        }
    });

    if(!user){
        return res.status(401).json({error: "User not found"})
    }
    const isValuePassword = await compare(senha, user.senha)
    if(!isValuePassword){
        return res.status(401).json({error: "Invalid Password"})
    }

    const token = sign({id: user.id}, "secret", {expiresIn: "1d"});
    const {id, nome, cargo} = user;
    return res.json({user: {id, email, nome, cargo}, token})
  }
}