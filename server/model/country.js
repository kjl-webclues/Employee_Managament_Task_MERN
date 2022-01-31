const mongoose = require('mongoose')

//Create a Schema
const countrySchema = new mongoose.Schema({
        countryId: {
            type: Number, 
            required: true
        },
        countryName: {
            type: String,
            required: true
        }    
})
const Country = mongoose.model("Country", countrySchema)
module.exports = Country