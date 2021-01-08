import { Router } from "express";
import * as multer from 'multer';
import AuthController from "../controller/AuthController";
import checkJwt from "../middlewars/checkJwt";
import * as fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync('./uploads')) fs.mkdirSync('./uploads')
        cb(null, './uploads/')
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
//Login route
router.post("/login", AuthController.login);

//register route
router.post("/register", upload.single('userImage'), AuthController.register);
//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;