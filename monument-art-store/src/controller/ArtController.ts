import { Art } from './../entity/Art';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import 'dotenv/config';

class ArtController {

  static index = async (req: Request, res: Response) => {  
    const baseURL = `${process.env.SERVER_HOST}:${process.env.PORT}`;

    //Get Arts from database
    const artRepository = getRepository(Art);
    const arts = await artRepository
                    .find({
                      order: {
                        id: 'DESC'
                      }
                    })
    const response = {
      count: arts.length,
      users: arts.map(art => {        
        return {
          _id: art.artId,
          title: art.title,
          image: `${baseURL}/${art.image}`,
          price: art.price,
          place: art.place,
          availableCopies: art.availableCopy,
          createdAt: art.createdAt,
          updatedAt: art.updatedAt
        }
      })
    }
    //Send the Arts object
    res.send(response);
  };

  static create = async (req: Request, res: Response) => {
      
    
    //Get parameters from the body  
    let { title, price, place, availableCopies } = req.body;
    if(!(title || price || place || availableCopies)) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    let art = new Art();
    art.title = title;
    art.place = place;
    art.image = (req.file.path != null && req.file.path != undefined) ? req.file.path : "";
    art.price = price;
    art.availableCopy = availableCopies;
    
    try {
    //Validade if the parameters are ok
    const errors = await validate(art, { validationError: { target: false } });
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    const artRepository = getRepository(Art);
    const existedArt = await artRepository.findOne({ where: { title: title } })
    
    if(!existedArt) {
        try {
        await artRepository.save(art);
        } catch (e) {
        res.status(409).send({
            success: false,
            error: e.sqlMessage
        });
        return;
        }
    } else {
        res.status(400).send({ success: false, error: `Art with title: ${title} is already in use!`});
        return;
    }
    
    } catch (error) {
    res.status(400).send(error);
    return;
    }
    //If all ok, send 201 response
    res.status(201).send({
        success: true,
        message: "Art created successfully!"
    });
          
  }

  static edit = async (req: Request, res: Response) => {
    //Get the ID from the url
    const _id = req.params.id;

    //Get values from the body
    let { title, price, place, availableCopies } = req.body;

    const artRepository = getRepository(Art);
    let art: Art;
    try {
      art = await artRepository.findOneOrFail(_id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Art not found");
      return;
    }

    //Validate the new values on model
    art.title = title;
    art.price = price;
    art.place = place;
    art.availableCopy = availableCopies;
    if(req.file.path != null || req.file.path != undefined) 
        art.image = req.file.path

    const errors = await validate(art);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save, if fails, that means title already in use
    try {
      await artRepository.save(art);
    } catch (e) {
      res.status(409).send(`Title: ${title} already in use!`);
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const _id = req.params.id;

    const artRepository = getRepository(Art);
    let art: Art;
    try {
      art = await artRepository.findOneOrFail(_id);
    } catch (error) {
      res.status(404).send("Art not found");
      return;
    }
    artRepository.delete(_id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

}

export default ArtController;