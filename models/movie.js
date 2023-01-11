const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require("./genre");
// const Genre = require('../routes/genres')

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie',movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        genreId: Joi.string(),
        genreName: Joi.string(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    });
    return schema.validate(movie);
}



exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovie;