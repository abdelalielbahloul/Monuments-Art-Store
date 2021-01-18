import { Art } from './../entity/Art';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import 'dotenv/config';
import * as fs from 'fs';

class ArtController {
    static baseURL: string = `${process.env.BASE_URL}:${process.env.PORT}`;

    static index = async (req: Request, res: Response) => {  

        //Get Arts from database
        const artRepository = getRepository(Art);
        const arts = await artRepository
                        .find({
                        order: {
                            id: 'DESC'
                        }
                        })
        const response = {
            arts: arts.map(art => { 
                return {
                    _id: art.artId,
                    title: art.title,
                    imagePath: art.image.trim().length !== 0 ? `${ArtController.baseURL}/${art.image}` : '',
                    image: art.image.split('\\')[2],
                    description: art.description,
                    price: art.price,
                    place: art.place,
                    availableCopies: art.availableCopy,
                    createdAt: art.createdAt,
                    updatedAt: art.updatedAt
                }
            })
        }
        //Send the Arts object
        res.send(response.arts);
    };

    static create = async (req: Request, res: Response) => {
        //Get parameters from the body  
        let { title, price, place, availableCopies, userId, description } = req.body;
        if(!(title || price || place || availableCopies || userId)) {
            if(req.file != null || req.file != undefined) {
                if(fs.existsSync(req.file.path)) { // check if old image exist
                    fs.unlink(req.file.path, (err) => {
                        if(err) res.send({ error: err})
                    }) // remove the old art image
                }
            }
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        let art = new Art();
        art.title = title;
        art.place = place;
        art.description = (description !== null || description !== undefined) ? description : ""
        art.userId = userId;
        art.image = (req.file.path != null && req.file.path != undefined) ? req.file.path : "";
        art.price = art.toCurrency(price, 'EUR');
        art.availableCopy = availableCopies;
        
        let createdArt: Art;
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
                    createdArt = await artRepository.save(art);
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
                        error: e.sqlMessage
                    });
                return;
                }
            } else {
                if(req.file != null || req.file != undefined) {
                    if(fs.existsSync(req.file.path)) { // check if old image exist
                        fs.unlink(req.file.path, (err) => {
                            if(err) res.send({ error: err})
                        }) // remove the old art image
                    }
                }
                res.status(409).send({ success: false, error: `Art with title: ${title} is already in use!`});
                return;
            }
        
        } catch (error) {
            if(req.file != null || req.file != undefined) {
                if(fs.existsSync(req.file.path)) { // check if old image exist
                    fs.unlink(req.file.path, (err) => {
                        if(err) res.send({ error: err})
                    }) // remove the old art image
                }
            }
            res.status(400).send(error);
            return;
        }
        //If all ok, send 201 response
        res.status(201).send({
            success: true,
            message: "Art created successfully!",
            _id: createdArt.artId
        });
            
    }

    static edit = async (req: Request, res: Response) => {
        //Get the ID from the url
        const _id = req.params.id;

        //Get values from the body
        let { title, price, place, availableCopies, userId, description } = req.body;

        const artRepository = getRepository(Art);
        let art: Art;
        try {
            art = await artRepository.findOneOrFail({ where: { artId: _id }});
        } catch (error) {
        //If not found, send a 404 response
            if(req.file != null || req.file != undefined) {
                if(fs.existsSync(req.file.path)) { // check if old image exist
                    fs.unlink(req.file.path, (err) => {
                        if(err) res.send({ error: err})
                    }) // remove the old art image
                }
            }
            res.status(404).send("Art not found");
            return;
        }

        //Validate the new values on model
        if(title != undefined && title != '')
            art.title = title;
        if(description != undefined && description != '')
            art.description = description;
        if(price != undefined && price != '')
            art.price = art.toCurrency(price, 'EUR');
        if(place != undefined && place != '')
            art.place = place;
        if(userId != undefined && userId != '')
            art.userId = userId;
        if(availableCopies != undefined && availableCopies > 0)
            art.availableCopy = availableCopies;        
        if(req.file != null || req.file != undefined) {
            if(fs.existsSync(art.image)) { // check if old image exist
                fs.unlink(art.image, (err) => {
                    if(err) res.send({ error: err})
                }) // remove the old art image
            }
            art.image = req.file.path // add new image
        }

        const errors = await validate(art, { validationError: { target: false } });
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save, if fails, that means title already in use
        try {
            await artRepository.update({ artId: art.artId }, art);
        } catch (e) {
            // fs.unlinkSync(art.image)
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
            art = await artRepository.findOneOrFail({ where: { artId: _id }});
        } catch (error) {
            res.status(404).send({message: "Art not found"});
            return;
        }    
        if(fs.existsSync(art.image)) {
            fs.unlink(art.image, err => {
                if(err) res.send({ error: err})
            }) 
        }
        await artRepository.remove(art);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

}

export default ArtController;