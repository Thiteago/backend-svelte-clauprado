import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

main()

async function main(){

  const nomes = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Isabella",
    "Sophia",
    "Mia",
    "Jackson",
    "Aiden",
    "Lucas",
    "Caden",
    "Harper",
    "Charlotte",
    "Amelia",
    "Ethan",
    "Benjamin",
    "Elijah",
    "Oliver",
    "Daniel",
    "Alexander",
    "James",
    "Samuel",
    "Henry",
    "Grace"
  ]

  const ruas: any = [
    "Main Street",
    "Elm Street",
    "Maple Avenue",
    "Oak Drive",
    "Pine Street",
    "Cedar Lane",
    "Walnut Avenue",
    "Cherry Lane",
    "Willow Street",
    "Birch Avenue",
    "Magnolia Drive",
    "Chestnut Street",
    "Ash Lane",
    "Sycamore Avenue",
    "Poplar Drive",
    "Juniper Street",
    "Hickory Lane",
    "Cypress Avenue",
    "Mulberry Street",
    "Spruce Drive",
    "Beech Lane",
    "Cottonwood Avenue",
    "Cactus Street",
    "Acacia Drive",
    "Olive Lane"
  ]

  const produtos = [
    "Balões",
    "Chapéus de Festa",
    "Confetes",
    "Serpentinas",
    "Pratos de Festa",
    "Copos",
    "Guardanapos",
    "Toalha de Mesa",
    "Decorações de Festa",
    "Lembrancinhas de Festa",
    "Convites de Festa",
    "Enfeites de Bolo",
    "Velas",
    "Jogos para Festa",
    "Pinhatas",
    "Talheres Descartáveis",
    "Canudos",
    "Mexedores de Bebida",
    "Bandeiras de Festa",
    "Acessórios para Cabine de Fotos",
    "Fundos para Festa",
    "Apitos",
    "Cornetas",
    "Estourador de Festa",
    "Utensílios Descartáveis de Mesa"
]

  let hash_password = await hash("123456", 8)
  let hash_admin_password = await hash("adminclau", 8)
  let users:any = []
  let enderecos:any = []
  let produtosCadastrados:any = []

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
    where: { rua: 'Rua do Admin'},
    update: {},
    create: {
      rua: 'Rua do Admin',
      numeroRua: "2667",
      bairro: "Centro",
      cidade: "Lorena",
      estado: "SP",
      cep: "12600-000",
      principal: true,
      user: {
        connect: {
          id: user_admin.id
        }
      }
    }
  })



  nomes.forEach((nome) => {
    users.push(
      prisma.user.upsert({
      where: { email: `${
        nome.toLowerCase()
      }@clauprado.com`},
      update: {},
      create: {
        nome: nome,
        dataNascimento: "1998-12-27",
        email: `${
          nome.toLowerCase()
        }@clauprado.com`,
        senha: hash_password,
        cpf: '42524592812',
        numeroTel: "123456789",
        numeroCel: "12997431974",
        cargo: "Usuario",
        status: "Ativo"
      }
    }))
  })

  ruas.forEach((rua: any, i: string | number) => {
    enderecos.push(prisma.endereco.upsert({
      where: {rua: rua },
      update: {},
      create: {
        rua: rua,
        numeroRua: "123",
        bairro: "Centro",
        cidade: "Lorena",
        estado: "SP",
        cep: "12600-000",
        principal: true,
        user: {
          connect: {
            id: users[i].id
          }
        }
      }
    }))
  })

  produtos.forEach((produto, i) => {
    produtosCadastrados.push(prisma.produto.upsert({
      where: { nome: produto },
      update: {},
      create: {
        nome: produto,
        descricao: "Descrição do produto",
        dataFabricacao: "2021-01-01",
        dataPublicacao: "2021-01-01",
        quantidadeEmEstoque: 25,
        peso: 0.5,
        valor: 10.00,
        altura: "10cm",
        largura: "10cm",
        comprimento: "10cm",
        material: "Papel",
        imagens: '1686086757905_1530909586240.png',
        tipo: i % 2 == 0 ? "Venda" : "Aluguel", 
        status: "Ativo",
      }
    }))
  })

  await prisma.promocao.upsert({
    where: { nome: "Promoção de Aniversário" },
    update: {},
    create: {
      nome: "Promoção de Aniversário",
      data_inicio: DateTime.now().toString(),
      data_fim: DateTime.now().plus({days: 7}).toString(),
      valor_desconto: 10,
      tipo: "porcentual",
      status: "Ativo",
      produtos: {
        connect: {
          id: produtosCadastrados[0].id
        }
      }
    }
  })

  for(let i = 0; i <= 11; i++){
    let produtosAlugados = produtosCadastrados.filter((produto:any) => produto.tipo == "Aluguel")
    await prisma.aluguel.upsert({
      where: { id: i },
      update: {},
      create: {
        produto: {
          connect: {
            id: produtosAlugados[i].id
          }
        },
      }
    })
  }

  for(let i = 0; i <= 12; i++){
    let produtosComprados = produtosCadastrados.filter((produto:any) => produto.tipo == "Venda")
    await prisma.venda.upsert({
      where: { id: i },
      update: {},
      create: {
        produto: {
          connect: {
            id: produtosComprados[i].id
          }
        },
      }
    })
  }


}