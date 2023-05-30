import multer from "multer";
import path from 'path'

export const storage_img = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve("public/slide_images"));
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime();

        callback(null, `${time}_${file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ._-]/g, '')}`)
    }
})