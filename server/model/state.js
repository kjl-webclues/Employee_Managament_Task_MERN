const mongoose = require('mongoose')

//Create a Schema
const stateSchema = new mongoose.Schema({
        stateId: {
            type: Number, 
            required: true
        },
        countryId: {
            type: Number, 
            required: true
        },
        stateName: {
            type: String,
            required: true
        }
       
})
const State = mongoose.model("State", stateSchema)
module.exports = State