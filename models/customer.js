const Joi = require('joi');
const mongoose = require('mongoose');
// const {boolean} = require("joi");

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    isGold:{
        type:Boolean,
        required: true
    },
    phone:{
        type:Number
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function customerValidate(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.number(),
    })
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = customerValidate;