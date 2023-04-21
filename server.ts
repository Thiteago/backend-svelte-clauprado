import express from "express"
import cors from "cors"
import { routerUser } from "./src/Routes/UsuarioRoute";
import { routerProduto } from "./src/Routes/ProdutoRoute";
import path from 'path'
import { routerCarrinho } from "./src/Routes/CarrinhoRoute";
import { routerPedido } from "./src/Routes/PedidoRoute";
import { routerPagamento } from "./src/Routes/PagamentoRoute";
import { routerPromocao } from "./src/Routes/PromocaoRoute";
import { scheduleAbandoned } from "./src/Routines";
import { routerRelatorio } from "./src/Routes/RelatoriosRoute";

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});



setInterval(scheduleAbandoned, 3 * 60 * 60 * 1000)

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use("/static", express.static(path.resolve(__dirname, "public","uploads")))
app.use(express.json());
app.use(cors(corsOptions));
app.use(limiter);
app.use(routerUser);
app.use(routerProduto);
app.use(routerCarrinho);
app.use(routerPedido)
app.use(routerPagamento)
app.use(routerPromocao)
app.use(routerRelatorio)
app.listen(3333, () => console.log('Server is running on port 3333'));


