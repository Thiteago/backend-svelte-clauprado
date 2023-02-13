import { Request, Response } from "express";
const pdf = require("html-pdf");
var Boleto = require('node-boleto').Boleto;
const time = new Date().getTime()

export class PagamentoController {
  async geraBoleto(req: Request, res: Response) {
    let valor = parseInt(req.params.valor)
    valor = valor * 100

    const boleto = new Boleto({
      'banco': "santander", // nome do banco dentro da pasta 'banks'
      'data_emissao': new Date(),
      'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente
      'valor': valor, // R$ 15,00 (valor em centavos)
      'nosso_numero': "1234567",
      'numero_documento': "123123",
      'cedente': "Pagar.me Pagamentos S/A",
      'cedente_cnpj': "18727053000174", // sem pontos e traços
      'agencia': "3978",
      'codigo_cedente': "6404154", // PSK (código da carteira)
      'carteira': "102"
    });

    boleto.renderHTML(function (html) {
      pdf.create(html).toFile(`./src/boletos/boleto${time}.pdf`, function (err: any, res: any) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
      });
    });
    
    return res.send('criado')
  }
}