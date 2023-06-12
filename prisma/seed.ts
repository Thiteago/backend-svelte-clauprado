import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

main()

async function main(){

  let hash_admin_password = await hash("adminclau", 8)


  let user_admin = await prisma.user.upsert({
    where: { email: 'admin@clauprado.com'},
    update: {},
    create: {
      nome: "Admin",
      dataNascimento: "1998-12-27",
      email: 'admin@clauprado.com',
      senha: hash_admin_password,
      cpf: '42524592812',
      numeroTel: "123456789",
      numeroCel: "12997431974",
      cargo: "Admin",
      status: "Ativo"
    }
  })
  

  await prisma.endereco.upsert({
    where: { id: 1},
    update: {},
    create: {
      rua: 'Rua do Admin',
      numeroRua: "2667",
      bairro: "Centro",
      cidade: "Lorena",
      estado: "SP",
      cep: "12460-000",
      principal: true,
      user: {
        connect: {
          id: user_admin.id
        }
      }
    }
  })




  

}