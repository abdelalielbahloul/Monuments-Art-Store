import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  if(!req.headers.authorization) {
    res.send({
      name: "jsonwebtoken",
      message: "token must be provided!"
    })
    return;
  }
  const hasBearerPrefix = req.headers.authorization.split(" ")[0]
  if(hasBearerPrefix != 'Bearer') {
    res.send({
      name: "Bearer Provider",
      message: "No Bearer prefix provided!"
    })
    return;
  }
  const token = <string>req.headers.authorization.split(" ")[1];
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send(error);
    return;
  }

  //The token is valid for 24 hour
  //We want to send a new token on every request
  const { userId, email, role } = jwtPayload;
  const newToken = jwt.sign({ userId, email, role }, config.jwtSecret, {
    expiresIn: "24h"
  });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};

export default checkJwt;