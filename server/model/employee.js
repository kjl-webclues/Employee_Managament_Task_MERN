const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')

//create a schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    profession: {
        type: String,
    },
    phone: {
        type: Number, 
    },
    salary1: {
        type: Number,
    },
    salary2: {
        type: Number,
    },
    salary3: {
        type: Number,
    },
    email: {
        type: String, 
        unique: true,
        //Validate EmailId
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
    },
    confirmpassword: {
        type: String,
    },
    countryId: {
        type: mongoose.Types.ObjectId, ref: 'Country',
    },
    stateId: {
        type: mongoose.Types.ObjectId, ref: 'State',
    },
    cityId: {
        type: mongoose.Types.ObjectId, ref: 'City',
    },

    Files: [
    {
        
        fileName: {
            type: String
        },
        fileType: {
            type: String
        },
        filePath: {
            type: String
        },
        public_Id: {
            type: String
        },
    }
    ],

    Token: [
        {
            token: {
                type: String,
                // required: true
            }
        }
    ]
})

//GENERATE TOKEN
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.Token = this.Token.concat({ token });

        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User
