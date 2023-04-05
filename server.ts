import express from "express"
import cors from "cors"
import { routerUser } from "./src/Routes/UsuarioRoute";
import { routerProduto } from "./src/Routes/ProdutoRoute";
import path from 'path'
import { routerCarrinho } from "./src/Routes/CarrinhoRoute";
import { routerPedido } from "./src/Routes/PedidoRoute";
import { routerPagamento } from "./src/Routes/PagamentoRoute";
import { routerPromocao } from "./src/Routes/PromocaoRoute";
import { routerRelatorio } from "./src/Routes/RelatoriosRoute";


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
app.use(routerUser);
app.use(routerProduto);
app.use(routerCarrinho);
app.use(routerPedido)
app.use(routerPagamento)
app.use(routerPromocao)
app.use(routerRelatorio)
app.listen(3333, () => console.log('Server is running on port 3333'));


