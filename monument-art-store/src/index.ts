import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import 'dotenv/config';
import {User} from "./entity/User";

const port = process.env.PORT || 3000;
const ServerHost = process.env.SERVER_HOST || '127.0.0.1';

createConnection().then(async connection => {

    // create express app
    const app = express();
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use('/uploads', express.static('uploads'));

    // register express routes from defined application routes
    // routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

    //         } 
    //         // else if (result !== null && result !== undefined) {
    //         //     res.json(result);
    //         // }
    //     });
    // });

    // setup express app here
    //Set all routes from routes folder
    app.use("/", routes);

    // start express server
    app.listen(port, () => {
        console.log(`Connected to ${connection.options.type} database named ${connection.options.database}`);
        console.log(`Server started on ${ServerHost}:${port}`);
    });
}).catch(error => console.log(error));
