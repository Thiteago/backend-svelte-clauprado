import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function scheduleAbandoned(){
  console.log('Verificando carrinhos abandonados...')
  const carts = await prisma.createdCart.findMany({
    where: {
      date: {
        lte: new Date(new Date().getTime() - 3 * 60 * 60 * 1000)
      },
      abandonado: false,
      resultouVenda: false
    }
  })

  if(carts.length > 0){
    carts.forEach(async cart => {
      await prisma.createdCart.update({
        where: {
          id: cart.id
        },
        data: {
          abandonado: true
        }
      })
    })
  }
  console.log('Verificação concluída!')
}

export async function scheduleDailyDespesas(){
  console.log('Verificando despesas recorrentes diarias...')
  const despesas = await prisma.despesas.findMany({
    where: {
      recorrente: true,
      tipoDeRecorrencia: 'dia',
      data: {
        lte: new Date()
      }
    }
  })

  if(despesas.length > 0){
    despesas.forEach(async despesa => {
      await prisma.despesas.create({
        data: {
          valor: despesa.valor,
          descricao: despesa.descricao,
          tipoDespesa: despesa.tipoDespesa,
          recorrente: despesa.recorrente,
          tipoDeRecorrencia: despesa.tipoDeRecorrencia,
          data: new Date()
        }
      })
    })
  }
  console.log('Verificação concluída!')
}

export async function scheduleMonthlyDespesas(){
  console.log('Verificando despesas recorrentes mensais...')
  
  const despesas = await prisma.despesas.findMany({
    where: {
      recorrente: true,
      tipoDeRecorrencia: 'mes',
      data: {
        lte: new Date()
      }
    }
  })

  if(despesas.length > 0){
    despesas.forEach(async despesa => {
      //check if despesa already exists in this month
      const despesaExists = await prisma.despesas.findFirst({
        where: {
          AND: [
            {
              recorrente: true,
              tipoDeRecorrencia: 'mes',
              data: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              }
            },
            {
              tipoDespesa: despesa.tipoDespesa
            }
          ]
        }
      })

      if(!despesaExists){
        await prisma.despesas.create({
          data: {
            valor: despesa.valor,
            descricao: despesa.descricao,
            tipoDespesa: despesa.tipoDespesa,
            recorrente: despesa.recorrente,
            tipoDeRecorrencia: despesa.tipoDeRecorrencia,
            data: new Date()
          }
        })
      }
    })
  }
  console.log('Verificação concluída!')
}

export async function scheduleYearlyDespesas(){
  console.log('Verificando despesas recorrentes anuais...')

  const despesas = await prisma.despesas.findMany({
    where: {
      recorrente: true,
      tipoDeRecorrencia: 'ano',
      data: {
        lte: new Date()
      }
    }
  })

  if(despesas.length > 0){
    despesas.forEach(async despesa => {
      //check if despesa already exists in this year
      const despesaExists = await prisma.despesas.findFirst({
        where: {
          AND: [
            {
              recorrente: true,
              tipoDeRecorrencia: 'ano',
              data: {
                gte: new Date(new Date().getFullYear(), 0, 1),
                lte: new Date(new Date().getFullYear(), 11, 31)
              }
            },
            {
              tipoDespesa: despesa.tipoDespesa
            }
          ]
        }
      })

      if(!despesaExists){
        await prisma.despesas.create({
          data: {
            valor: despesa.valor,
            descricao: despesa.descricao,
            tipoDespesa: despesa.tipoDespesa,
            recorrente: despesa.recorrente,
            tipoDeRecorrencia: despesa.tipoDeRecorrencia,
            data: new Date()
          }
        })
      }
    })
  }
  console.log('Verificação concluída!')
}

export async function schedulePromoAgendadoToActive(){ 
  console.log('Verificando promoções agendadas...')
  const promocoes = await prisma.promocao.findMany({
    where: {
      status: 'Agendado',
      data_inicio: {
        lte: new Date()
      }
    }
  })

  if(promocoes.length > 0){
    promocoes.forEach(async promocao => {
      await prisma.promocao.update({
        where: {
          id: promocao.id
        },
        data: {
          status: 'Ativo',
        }
      })
    })
  }
  console.log('Verificação concluída!')
}

export async function schedulePromoAtivoToInativo() {
  console.log('Verificando promoções ativas...')
  const promocoes = await prisma.promocao.findMany({
    where: {
      status: 'Ativo',
      data_fim: {
        lte: new Date()
      }
    }
  })

  if(promocoes.length > 0){
    promocoes.forEach(async promocao => {
      await prisma.promocao.update({
        where: {
          id: promocao.id
        },
        data: {
          status: 'Inativo',
        }
      })
    })
  }
  console.log('Verificação concluída!')
  
}
