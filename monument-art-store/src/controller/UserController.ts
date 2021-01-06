import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {

static index = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(User);
  const users = await userRepository
                  .find({ select: [
                    "userId", 
                    "email", 
                    "userImage", 
                    "role", 
                    "createdAt", 
                    "updatedAt"
                  ]})

  //Send the users object
  res.send(users);
};

static show = async (req: Request, res: Response) => {
  //Get the ID from the url
  const _id: string = req.params.id;

  //Get the user from database
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(_id, {
       select: [
        "userId",  
        "email", 
        "userImage", 
        "role", 
        "createdAt", 
        "updatedAt"
      ]
    });

    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
};

static create = async (req: Request, res: Response) => {
  //Get parameters from the body
  let { email, userImage, password, role } = req.body;
  let user = new User();
  user.userId = user.generateId();
  user.email = email;
  user.userImage = userImage;
  user.password = password;
  user.role = role;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.hashPassword();

  //Try to save. If fails, the username is already in use
  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send({
      "success": false,
      error: e
    });
    return;
  }

  //If all ok, send 201 response
  res.status(201).send("User created successfully!");
};

static edit = async (req: Request, res: Response) => {
  //Get the ID from the url
  const _id = req.params.id;

  //Get values from the body
  const { email, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(_id);
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send("User not found");
    return;
  }

  //Validate the new values on model
  user.email = email;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("email already in use");
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
    user = await userRepository.findOneOrFail(_id);
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  userRepository.delete(_id);

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
};

export default UserController;