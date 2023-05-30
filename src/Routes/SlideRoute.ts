import { Router } from "express"
import { SlideController } from "../Controller/SlideController";
import multer from "multer";
import { storage_img } from "../utils/multerConfigSlide";

const upload = multer({storage: storage_img})

const slidecontroller = new SlideController()
export const routerSlide = Router();

routerSlide.post("/slide/adicionar",upload.array('imagens', 4), slidecontroller.cadastrar);
routerSlide.patch("/slide/:id/alterar",upload.array('imagens', 4), slidecontroller.alterar)