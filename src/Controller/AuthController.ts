import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export class AuthController {
  async authenticate(req: Request, res: Response) {
    const {
        email,
        senha,
    } = req.body;
    const user = await prisma.user.findUnique({where: {email}});

    if(!user){
        return res.json({error: "User not found"})
    }
    const isValuePassword = await compare(senha, user.senha)
    if(!isValuePassword){
        return res.json({error: "Invalid Password"})
    }

    const token = sign({id: user.id}, "secret", {expiresIn: "1d"});
    const {id} = user;
    return res.json({user: {id, email}, token})
  }
}