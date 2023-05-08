import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main(){

  let hash_password = await hash("123456", 8)
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

  let user_joao = await prisma.user.upsert({
      where: { email: 'joao@gmail.com'},
      update: {},
      create: {
        nome: "João",
        dataNascimento: "1999-01-01",
        email: 'joao@gmail.com',
        senha: hash_password,
        cpf: '12345678910',
        numeroTel: "123456789",
        numeroCel: "123456789",
        cargo: "Usuario",
        status: "Ativo"
      }
  })

  let user_maria = await prisma.user.upsert({
    where: { email: 'maria@gmail.com'},
    update: {},
    create: {
      nome: "Maria",
      dataNascimento: "1999-01-01",
      email: 'maria@gmail.com',
      senha: hash_password,
      cpf: '12345678911',
      numeroTel: "123456789",
      numeroCel: "123456789",
      cargo: "Usuario",
      status: "Ativo"
    }
  })

  let user_jose = await prisma.user.upsert({
    where: { email: 'jose@gmail.com'},
    update: {},
    create: {
      nome: "jose",
      dataNascimento: "1999-01-01",
      email: 'jose@gmail.com',
      senha: hash_password,
      cpf: '12345678912',
      numeroTel: "123456789",
      numeroCel: "123456789",
      cargo: "Usuario",
      status: "Ativo"
    }
  })

  let user_pedro = await prisma.user.upsert({
    where: { email: 'pedro@gmail.com'},
    update: {},
    create: {
      nome: "pedro",
      dataNascimento: "1999-01-01",
      email: 'pedro@gmail.com',
      senha: hash_password,
      cpf: '12345678913',
      numeroTel: "123456789",
      numeroCel: "123456789",
      cargo: "Usuario",
      status: "Ativo"
    }
  })

  let ids = [user_joao.id, user_maria.id, user_jose.id, user_pedro.id]

  for(let i = 1; i <= 4; i++){
    let endereco = await prisma.endereco.create({
      data: 
      {
        rua: `Rua ${i}`,
        numeroRua: `${i}`,
        bairro: `Bairro ${i}`,
        cidade: `Cidade ${i}`,
        estado: `Estado ${i}`,
        cep: `${i}2345678`,
        principal: true,
        
        user: {
          connect: { id: ids[i] },
        },
      },
    })

    if(i == 1){
      await prisma.endereco.create({
        data:
        {
          rua: 'Av Castelo Branco',
          numeroRua: '2667',
          bairro: 'Morro do Elefante',
          cidade: 'Campos do Jordão',
          estado: 'SP',
          cep: '12460000',
          principal: true,

          user: {
            connect: { id: user_admin.id },
          }
        }
      })
    }
    let produto:any = []
    if(i%2 == 0){
      produto = await prisma.produto.create({
        data: 
        {
          nome: `Produto ${i}`,
          descricao: `Descrição ${i}`,
          dataFabricacao: new Date("2021-01-01"),
          dataPublicacao: new Date("2021-01-01"),
          quantidadeEmEstoque: 1,
          peso: 1,
          valor: 1,
          altura: "1",
          largura: "1",
          comprimento: "1",
          material: "Material",
          categoria: "Topo de Bolo",
          imagens: ["Imagem"],
          tipo: "Aluguel",
          status: "Ativo"
        }
      })
    }else{
      produto = await prisma.produto.create({
        data: 
        {
          nome: `Produto ${i}`,
          descricao: `Descrição ${i}`,
          dataFabricacao: new Date("2021-01-01"),
          dataPublicacao: new Date("2021-01-01"),
          quantidadeEmEstoque: 1,
          peso: 1,
          valor: 1,
          altura: "1",
          largura: "1",
          comprimento: "1",
          material: "Material",
          categoria: "Topo de Bolo",
          imagens: ["Imagem"],
          tipo: "Venda",
          status: "Ativo"
        }
      })
    }

    if(i == 1){
      await prisma.promocao.create({
        data:
        {
          nome: `Promoção ${i}`,
          data_fim: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          categorias: ["Categoria"],
          valor_desconto: 1,
          tipo: "porcentual",
          status: "Ativo",

          produtos: {
            connect: { id: produto.id },
          },
        }
      })
    }
    let aluguel:any = []
    let venda:any = []
    let pedido:any = []	
    if(i%2 == 0){
      aluguel = await prisma.aluguel.create({
        data: 
        {
          data_aluguel: new Date(),
          data_disponibilidade: new Date(),
          data_expiracao: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          status_aluguel: "Disponivel",
          dias_alugados: 0,
          tipo: "Aluguel",

          produto: {
            connect: { id: produto.id },
          },
        },
      })
      pedido = await prisma.pedido.create({
        data:
        {
          valor: 1,
          valor_frete: 1,
          tipo_frete: "PAC",
          status: "Finalizado",
          data_envio: new Date(),
          codigo_rastreio: "123456789",
          userId: ids[i],
          enderecoId: endereco.id,
          
          alugueis: {
            connect: { id: aluguel.id },
          },
        }
      })
    }else{
      venda = await prisma.venda.create({
        data:
        {
          tipo: "Venda",
          status_venda: "Disponivel",
          produtoId: produto.id
        }
      })
      pedido = await prisma.pedido.create({
        data:
        {
          valor: 1,
          valor_frete: 1,
          tipo_frete: "PAC",
          status: "Finalizado",
          data_envio: new Date(),
          codigo_rastreio: "123456789",
          userId: ids[i],
          enderecoId: endereco.id,
          
          vendas: {
            connect: { id: venda.id },
          },
        }
      })
    }

    

    let pagamento = await prisma.pagamento.create({
      data:
      {
        data_pagamento: new Date(),
        valor: 1,
        forma_pagamento: "Boleto",
        status: "Pago",
        vezes: "A vista",
        pedidoId: pedido.id
      },
    })

    let boleto = await prisma.boleto.create({
      data: 
      {
        data_venc: new Date(),
        valor: 1,
        linhaDigitavel: "123456789",
        numeroBoleto: "123456789",
        nomePDF: "Boleto",
        pagamentoId: pagamento.id
      },
    })

    await prisma.visit.create({
      data: 
      {
        logado: true
      }
    })

    await prisma.createdCart.create({
      data: 
      {
        abandonado: false,
        resultouVenda: false,
        cartId: i
      }
    })

    await prisma.statisticProduct.create({
      data: 
      {
        qtdeVendida: 0,
        qtdeAlugada: 0,
        qtdeVisualizada: 0,
        totalLucro: 0,
        produtoId: produto.id
      },
    })

    await prisma.despesas.create({
      data: 
      {
        valor: 1,
        data: new Date(),
        descricao: "Descrição",
        tipoDespesa: "Tipo",
        recorrente: false,
      }
    })

    await prisma.avaliacoes.create({
      data: 
      {
        nota: 1,
        titulo: "Titulo",
        descricao: "Descrição",
        userId: ids[i],
        produtoId: produto.id
      }
    })
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  

