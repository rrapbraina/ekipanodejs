const mongoose = require('mongoose');
const {Movie, movieSchema} = require("./movie")
const {Customer, customerSchema} = require('./customer');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    rentalNumber: {
        type: Number
    },
    customer: {
        type: customerSchema
    },
    movie: {
        type: movieSchema
    },
    releaseDate:{
        type: Date
    },
    returnDate:{
        type: Date
    }
});

const Rental =  mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customerId:Joi.string(),
        movieId:Joi.string(),
        releaseDate: Joi.date(),
        returnDate: Joi.date(),
        rentalNumber:Joi.number()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
exports.validateRental = validateRental;