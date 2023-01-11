const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const {validateRental, Rental} = require("../models/rental");
const{Movie} = require('../models/movie');
const {Customer} = require('../models/customer');


Fawn.init('mongodb://localhost/vidly');

router.get('/', async (req, res) => {
    const rentals = await Rental.find();
    if(rentals.length === 0){
        return res.status(404).send('is empty');
    }
    res.send(rentals);
});

router.delete('/', async(req, res) => {
    const rental = await Rental.deleteMany();
    res.send('Deleted ' + rental.deletedCount + ' movies');
});

router.post('/', async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) res.status(404).send('There is no customer with the given id');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) res.status(404).send('There is no movie with the given id');

    let rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold
        },
        movie:{
            _id: movie._id,
            title:movie.title,
            genre:movie.genre,
            numberInStock:movie.numberInStock,
            dailyRentalRate:movie.dailyRentalRate
        },
        releaseDate:req.body.releaseDate,
        returnDate:req.body.returnDate,
        rentalNumber: req.body.rentalNumber
    });
    // for(let numberRental =0; numberRental< movie.numberInStock; numberRental++){
    //     rental = await rental.save();
    //     res.send(rental);
    //     if(movie.numberInStock === 0 || movie.numberInStock <= numberRental){
    //         console.log('there is no movie in stock');
    //     }
    //     return;
    // }
    //
    // return res.status(404).send('there is no movie');

     try{
         new Fawn.Task()
             .save('rentals', rental)
             .update('movies', { _id: movie._id }, {
                 $inc: { numberInStock: -1 }
             })
             .run();

         res.send(rental);
     }
     catch (ex){
         res.status(500).send('Something failed...');
     }

    // let numberFree = 0;
    // let ns = movie.numberInStock;
    // if(numberFree < ns){
    //     numberFree++;
    //     rental = await rental.save();
    //     res.send(rental);
    // }else{
    //     return res.status(400).send('There is no movie in stock')
    // }

});

module.exports = router;