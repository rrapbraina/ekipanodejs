const mongoose = require('mongoose');
const{Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const {boolean, number} = require("joi");
const {mongo} = require("mongoose");
const router = express.Router();


router.get('/', async(req, res) => {

    const movies = await Movie.find().sort('name');
    res.send(movies);

    if(movies.length === 0){
        return res.status(404).send('There is no movie available')
    }
})



router.get('/:id', async(req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404)
    res.send(movie);
})

router.post('/', async(req, res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) res.status(404).send('There is no genre');

    let movie = new Movie({
        title:req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);

})

router.put('/:id', async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.body.genreId,{ name: req.body.genreName},{
        new:true
    });
    if(!genre) return res.status(400).send('Invalid genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title:req.body.title,
            genre:{
                _id:genre._id,
                name:genre.name
            },
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
        },{new:true})
    if(!movie) return res.status(404).send('The move with the Given ID is not found');
    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('Movie with the given ID does not exist');
    res.send(movie);
});

router.delete('/', async(req, res) => {
    const movie = await Movie.deleteMany();
    res.send('Deleted ' + movie.deletedCount + ' movies');
});



module.exports = router;