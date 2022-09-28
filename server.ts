import express from "express"
import cors from "cors"
import { routerUser } from "./src/Routes/UsuarioRoute";
import { routerProduto } from "./src/Routes/ProdutoRoute";
import path from 'path'


const app = express();




const corsOptions = {
  Origin: '*',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use("/static", express.static(path.resolve(__dirname, "public","uploads")))
app.use(express.json());
app.use(cors(corsOptions));
app.use(routerUser);
app.use(routerProduto)
app.listen(3333, () => console.log('Server is running on port 3333'));


