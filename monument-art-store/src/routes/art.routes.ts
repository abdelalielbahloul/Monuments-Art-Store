import { Router } from "express";
import multer from 'multer';
import ArtController from "../controller/ArtController";
import checkJwt  from "../middlewars/checkJwt";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync('./uploads/arts')) fs.mkdirSync('./uploads/arts')
        cb(null, './uploads/arts/')
    },
    filename: function (req, file, cb) {         
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const fileFilter = (req, file, cb ) => {
    
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        // To accept the file pass `true`, like so:
        cb(null, true);
        return;
    } else{
        // To reject this file pass `false`, like so:
        cb(null, false);
        cb( new Error('The file mime type is not acceptable!'))       
    }

};
const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const router = Router();

//Get all arts
router.get("/", [checkJwt], ArtController.index);

//Create a new art
router.post("/", upload.single('image'), [checkJwt], ArtController.create);

//Edit one art
router.patch("/:id", upload.single('image'), [checkJwt], ArtController.edit);

//Delete one art
router.delete("/:id", [checkJwt], ArtController.delete);

export default router;