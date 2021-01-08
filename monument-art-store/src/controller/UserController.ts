import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

import { User } from "../entity/User";
import { Art } from "../entity/Art";

class UserController {

  static index = async (req: Request, res: Response) => {
    const baseURL = `${process.env.SERVER_HOST}:${process.env.PORT}`;

    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository
                    .find({ 
                      join: {
                        alias: 'user',
                        leftJoinAndSelect: { role: 'user.role'}
                      },
                      order: {
                        id: 'DESC'
                      }
                    })
    const response = {
      count: users.length,
      users: await Promise.all(users.map(async user => {     
        const artRepository = getRepository(Art)        
        return {
          _id: user.userId,
          name: user.name,
          image: `${baseURL}/${user.userImage}`,
          email: user.email,
          role: user.role.name,
          contributions: await artRepository.count({ where: { userId: user.userId }}),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }))
    }
    //Send the users object
    res.send(response);
  };

  static show = async (req: Request, res: Response) => {
    //Get the ID from the url
    const _id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(_id, {
        join: {
          alias: 'user',
          leftJoinAndSelect: { role: 'user.role'}
        }
      });
      const artRepository = getRepository(Art);
      const nbrContributions = await artRepository.count({ where: { userId: user.userId }});
      const response = {
        _id: user.userId,
        email: user.email,
        name: user.name,
        image: user.userImage,
        role: user.role.name,
        contributions: nbrContributions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.send(response);
    } catch (error) {
      res.status(404).send({message: "User not found"});
    }
  };

  static create = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { email, password, role } = req.body;
    let user = new User();
    user.userId = uuidv4();
    user.email = email;
    user.userImage = (req.file != null && req.file != undefined) ? req.file.path : "";
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      if(req.file != null || req.file != undefined) {
        if(fs.existsSync(req.file.path)) { // check if old image exist
            fs.unlink(req.file.path, (err) => {
                if(err) res.send({ error: err})
            }) // remove the old art image
        }
      }
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the email is already in use
    const userRepository = getRepository(User);
    let createdUser: User;
    try {
      createdUser = await userRepository.save(user);
    } catch (e) {
      if(req.file != null || req.file != undefined) {
        if(fs.existsSync(req.file.path)) { // check if old image exist
            fs.unlink(req.file.path, (err) => {
                if(err) res.send({ error: err})
            }) // remove the old art image
        }
      }
      res.status(409).send({
        success: false,
        error: e
      });
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({
      success: true, 
      message: "User created successfully!",
      _id: createdUser.userId
    });
  };

  static edit = async (req: Request, res: Response) => {
    //Get the ID from the url
    const _id = req.params.id;

    //Get values from the body
    const { email, role, name } = req.body;
    

    //Try to find user on database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { userId: _id }});
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({message: "User not found"});
      return;
    }

    //Validate the new values on model
    user.email = email;
    user.role = role;
    user.name = name;
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save, if fails, that means username already in use
    try {
      await userRepository.update({ userId: user.userId }, user);
    } catch (e) {      
      res.status(409).send({error: "email already in use!"});
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const _id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({where: { userId: _id }});
    } catch (error) {
      res.status(404).send({message: "User not found"});
      return;
    }
    // delete image of deleted user
    fs.unlinkSync(user.userImage);
    await userRepository.remove(user);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default UserController;