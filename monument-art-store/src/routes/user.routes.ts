import { Router } from "express";
import multer from 'multer';
import UserController from "../controller/UserController";
import checkJwt  from "../middlewars/checkJwt";
import checkRole from "../middlewars/checkRole";
import fs from 'fs';


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

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN", "USER"])], UserController.index);

// Get one user
router.get("/:id", [checkJwt, checkRole(["ADMIN"])], UserController.show);

//Create a new user
router.post("/", upload.single('userImage'), [checkJwt, checkRole(["ADMIN"])], UserController.create);

//Edit one user
router.patch("/:id", upload.single('userImage'), [checkJwt, checkRole(["ADMIN"])], UserController.edit);

//Delete one user
router.delete("/:id", [checkJwt, checkRole(["ADMIN"])], UserController.delete);

export default router;