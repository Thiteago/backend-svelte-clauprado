import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export class PagamentoController {
  async enviarBoleto(req: Request, res: Response) {
    const idPagamento = req.params.idPagamento

    const pagamento = await prisma.pagamento.findUnique({
      where: {
        id: Number(idPagamento)
      },
      include: {
        boleto: true
      }
    })

    if(!pagamento) {
      return res.status(404).json({message: 'Pagamento não encontrado'})
    }

    const boletoPath = `/git/backend/src/boletos/boleto${pagamento.boleto?.nomePDF}.pdf`
    res.sendFile(boletoPath)
  }
}