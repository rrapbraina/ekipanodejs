const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
// const {func} = require("joi");
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();
const {validateGenre, Genre} = require("../models/genre");




// const genres = [
//     { id: 1, name: 'Action'},
//     { id: 2, name: 'Horror'},
//     { id: 3, name: 'Romance'}
// ];

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    if(genres.length === 0){
        return res.status(404).send('is empty');
    }
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre);

});

router.put('/:id', async(req, res) => {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name},{
        new: true
    });
    if(!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

router.delete('/:id', [auth,admin], async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send('The genre with the given ID does not exist');
    res.send(genre);
});

router.delete('/', async (req, res) => {
    const genre = await Genre.deleteMany();
    res.send('Deleted ' + genre.deletedCount + ' documents');
})

module.exports = router;
