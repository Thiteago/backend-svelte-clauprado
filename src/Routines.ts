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

}

