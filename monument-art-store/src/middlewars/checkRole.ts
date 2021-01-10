import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { UserRole } from "../entity/UserRole";

const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    //Get the user ID from previous midleware
    const userId = res.locals.jwtPayload.userId;    

    //Get user role from the database
    const userRepository = getRepository(User);
    const roleRepository = getRepository(UserRole);
    let user: User;
    try {
      user = await userRepository.findOne({ userId: userId }, {
        join: {
          alias: 'user',
          leftJoinAndSelect: { role: 'user.role'}
        }
      });        

    } catch (error) {
      res.status(401).send(error);

    }

      //Check if Array of authorized roles includes the user's role
    if (roles.indexOf(`${user.role.name}`, 0) > -1) 
      next();
    else 
      res.status(401).send();
  };
};

export default checkRole;