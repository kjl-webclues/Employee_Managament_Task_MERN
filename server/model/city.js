const mongoose = require('mongoose')

//Create a Schema
const citySchema = new mongoose.Schema({
    cityId: {
        type: Number, 
        required: true
    },
    stateId: {
        type: Number, 
        required: true
    },
    cityName: {
        type: String,
        required: true
    }
})
const City = mongoose.model("City", citySchema)
module.exports = City