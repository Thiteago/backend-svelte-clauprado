import {Router} from "express"
import { UsuarioController } from "../Controller/UsuarioController";
import { AuthController } from "../Controller/AuthController";

const usuariocontroller = new UsuarioController()
const authcontroller = new AuthController()
export const routerUser = Router();


routerUser.post("/NovoUsuario", usuariocontroller.cadastrar);
routerUser.post("/Autenticar", authcontroller.authenticate)
routerUser.post('/Usuarios/:id/NovoEndereco', usuariocontroller.cadastrarNovoEndereco)

routerUser.get('/Usuarios', usuariocontroller.listar);
routerUser.get('/Usuarios/:id/dados', usuariocontroller.mostrarInfo)
routerUser.get('/Usuarios/:id/Enderecos', usuariocontroller.listarEnderecos)

routerUser.patch('/Usuarios/:id/Alterar', usuariocontroller.alterarUser)
routerUser.patch('/Usuarios/:id/AtualizarEndereco', usuariocontroller.atualizarEndereco)
routerUser.patch("/Usuarios/alterar/cargo/:id", usuariocontroller.atualizarCargo);




