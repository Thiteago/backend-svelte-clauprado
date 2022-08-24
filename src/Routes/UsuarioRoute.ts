import {Router} from "express"
import { UsuarioController } from "../Controller/UsuarioController";
import { AuthController } from "../Controller/AuthController";
import { AuthMiddleware } from "../middlewares/auth";

const usuariocontroller = new UsuarioController()
const authcontroller = new AuthController()
export const router = Router();


router.post("/NovoUsuario", usuariocontroller.cadastrar);
router.get('/Usuarios', AuthMiddleware ,usuariocontroller.listar);
router.post("/Autenticar", authcontroller.authenticate)



