import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

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

    // setup express app here
        //Set all routes from routes folder
        app.use("/", routes);

    // swagger
    let options = {
        explorer: true
    };      
    // start express server
    app.listen(port, () => {
        app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
        console.log(`Connected to ${connection.options.type} database named ${connection.options.database}`);
        console.log(`Server started on ${ServerHost}:${port}`);
    });
}).catch(error => console.log(error));
