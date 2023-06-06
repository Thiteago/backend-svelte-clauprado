import express from "express"
import cors from "cors"
import cron from "node-cron"
import path from 'path'
import  morgan  from "morgan";
import { rateLimit } from "express-rate-limit";
import { routerUser } from "./src/Routes/UsuarioRoute";
import { routerProduto } from "./src/Routes/ProdutoRoute";
import { routerCarrinho } from "./src/Routes/CarrinhoRoute";
import { routerPedido } from "./src/Routes/PedidoRoute";
import { routerPagamento } from "./src/Routes/PagamentoRoute";
import { routerPromocao } from "./src/Routes/PromocaoRoute";
import { routerRelatorio } from "./src/Routes/RelatoriosRoute";
import { routerDespesas } from "./src/Routes/DespesasRoute";
import { routerAvaliacoes } from "./src/Routes/AvaliacoesRoute";
import { routerAluguel } from "./src/Routes/AluguelRoute";
import { routerSlide } from "./src/Routes/SlideRoute";
import { routerCategoria } from "./src/Routes/CategoriaRoute";

import { scheduleAbandoned, scheduleDailyDespesas ,scheduleMonthlyDespesas , 
  scheduleYearlyDespesas, schedulePromoAgendadoToActive, schedulePromoAtivoToInativo,
  scheduleRentStatus} 
from "./src/Routines";


// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, 
//   max: 100, 
//   message: "Too many requests from this IP, please try again later.",
// });

cron.schedule('0 0 * * *', () => { // 0 0 * * * = 00:00 todos os dias
  schedulePromoAgendadoToActive()
  schedulePromoAtivoToInativo
  scheduleDailyDespesas()
  scheduleRentStatus()
})

cron.schedule('*/15 * * * *', () => { // */15 * * * * = a cada 15 minutos
  scheduleAbandoned()
})

cron.schedule('0 0 1 * *', () => { // 0 0 1 * * = 00:00 todo dia 1
  scheduleMonthlyDespesas()
})

cron.schedule('0 0 1 1 *', () => { // 0 0 1 1 * = 00:00 todo dia 1 de janeiro
  scheduleYearlyDespesas()
})


const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(morgan("dev"));
app.use("/static", express.static(path.resolve(__dirname, "public","uploads")))
app.use("/static/slide", express.static(path.resolve(__dirname, "public","slide_images")))
app.use(express.json());
app.use(cors(corsOptions));
// app.use(limiter);
app.use(routerUser);
app.use(routerProduto);
app.use(routerCarrinho);
app.use(routerPedido)
app.use(routerPagamento)
app.use(routerPromocao)
app.use(routerRelatorio)
app.use(routerCategoria)
app.use(routerDespesas)
app.use(routerAluguel)
app.use(routerSlide)
app.use(routerAvaliacoes)
app.listen(3333, () => console.log('Server is running on port 3333'));


