import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { User } from "../entity/User";
import config from "../config/config";
import { UserRole } from "../entity/UserRole";

class AuthController {
  static login = async (req: Request, res: Response) => {
    console.log(req.body);
    
    //Check if username and password are set
    let { login, password } = req.body;
    if (!(login && password)) {
      res.status(400).send({ msg: "Login failed!" });
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email: login } });
    } catch (error) {
      res.status(401).send({ msg: "Login faild!" });
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ msg: "Login failed!" });
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign({ 
                  userId: user.userId, 
                  username: user.email 
                },
                config.jwtSecret,
                { expiresIn: "24h" }
    );

    //Send the jwt in the response
    res.send({
      success: true,
      token: token,
      expiredIn: "24h"
    });
  };

  static register = async (req: Request, res: Response) => {
      
    
    //Get parameters from the body  
    let { name, email, password, role } = req.body;
    if(!(name || email || password || role)) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }
    let user = new User();
    user.userId = uuidv4();
    user.name = name;
    user.email = email;
    user.userImage = (req.file.path != null && req.file.path != undefined) ? req.file.path : "";
    user.password = password;
    user.role = role;

    // console.log(`${baseURL}/${user.userImage}`);


    //validate the sent role
    const roleRepository = getRepository(UserRole);
    const sentRole = await roleRepository.findOne({ where: { id: role } });
    
    if(sentRole != undefined && sentRole != null) {

      try {
        //Validade if the parameters are ok
        const errors = await validate(user, { validationError: { target: false } });
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        const existedUser = await userRepository.findOne({ where: { email: email } })
        
        if(!existedUser) {
          try {
            await userRepository.save(user);
          } catch (e) {
            res.status(409).send({
              success: false,
              error: e.sqlMessage
            });
            return;
          }
        } else {
          res.status(400).send({ success: false, error: "User already exist!"});
          return;
        }
       
      } catch (error) {
        res.status(400).send(error);
        return;
      }
      //If all ok, send 201 response
      res.status(201).send({
        success: true,
        message: "User created successfully!"
      });

    } else {
      res.status(404).send({
        success: false,
        error: "User Role Not Found!"
      });
      return;
    }
          
  }

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}

export default AuthController;