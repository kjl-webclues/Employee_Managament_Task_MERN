const express = require('express')
const router = express.Router()
const User = require('../model/employee')
const Country = require('../model/country')
const State = require('../model/state')
const City = require('../model/city')
const authenticate = require ("../middleware/checkAuth")

//////////////////////////////// For Get Country List ////////////////////////////////
router.get('/getCountry', async (req, res) => {
    try {
        const country = await Country.find()
        res.send(country)
    } catch (err) {
        res.send('Error' + err)
    }
})

// ///////////////////////////////// For Get StateList ////////////////////////////////
router.get('/getState/:countryId', async (req, res) => {
    try {
        const id = req.params.countryId
        aggregateQuery =[{
            $match: {"countryId" :id}
        }]

        const userData = await State.aggregate(aggregateQuery)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

// //////////////////////////////// For Get StateList ////////////////////////////////
router.get('/getCity/:stateId', async (req, res) => {
    try {
        const id = req.params.stateId
        aggregateQuery =[{
            $match: {"stateId" : id }
        }]

        const userData = await City.aggregate(aggregateQuery)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////////// For Get User And Pagination/Requestin/sorting ///////////////////////////////////
router.get('/getUser', authenticate, async (req, res) => {
    try {
        const {page,sort,Request} = req.query
        const limit = 5
        let skip = (page - 1) * limit;
        
        const aggregateQuery = []
        
        
/////////////////////////////////////// Get Data of Collections ///////////////////////////////
        
        aggregateQuery.push(
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country"
                }
            })
            aggregateQuery.push(
                {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "state"
                }
            })            
            aggregateQuery.push(
                {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "city"
                }
                })
        
        //////////////////////////////// For Searching ////////////////////////////////
        if(Request !== ""){

            aggregateQuery.push(
                {
                    $match: {
                        $or: [
                            { "name": RegExp("^" + Request, "i") },
                            { "phone": parseInt(Request) },
                            { "profession": RegExp("^" + Request, "i") },
                            { "email": RegExp("^" + Request, "i") },                            
                            { "country.countryName": RegExp("^" + Request, "i") },
                            { "state.stateName": RegExp("^" + Request, "i") },
                            { "city.cityName": RegExp("^" + Request, "i") }   
                        ]   
                    }
                },    
            )
            
            
            const matchUser = await User.aggregate([aggregateQuery]);

            
            let totalPage = Math.ceil(matchUser.length/limit);
            
            aggregateQuery.push(
                //////////////////////////////// sorting ////////////////////////////////
                {$sort: { name : sort === "descending" ? -1 : 1}},

                //////////////////////////////// Pagination ////////////////////////////////
                {
                    $skip: skip
                },
                {
                    $limit: limit  
                }  
                     
            )
            ////////////////////////////////// Apply AggreagteQuery In User Collection ////////////////////////////////
            const users = await User.aggregate([aggregateQuery]);
            
            ////////////////////////////////// Send Response ////////////////////////////////
            res.send({users, totalPage});   
        } 
        else if(Request === ""){

            ////////////////////////////////// Count Total Documents ////////////////////////////////
            const total = await User.countDocuments({});

            ////////////////////////////////// Count Total Pages ////////////////////////////////
            let totalPage = Math.ceil(total/limit);

            aggregateQuery.push(
                
                ////////////////////////////////// sorting ////////////////////////////////
                {$sort: { name : sort === "descending" ? -1 : 1}},

                ////////////////////////////////// Pagination ////////////////////////////////
                {
                    $skip: skip
                },
                {
                    $limit: limit  
                }  
            )
            console.log(aggregateQuery);
            ////////////////////////////////// Apply AggreagteQuery In User Collection ////////////////////////////////
            const users = await User.aggregate([aggregateQuery]);
            
            ////////////////////////////////// Send Response ////////////////////////////////
            res.send({users, totalPage});   
        }
                
    
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Register User ////////////////////////////////
router.post('/signUp', async (req, res) => {
     const user = req.body
    try {
        const emailExist = await User.findOne({ email: user.email })
        if (emailExist) {
            res.send("Email already Exists")
        } else {
            const result = await User(user).save();
            res.send("Register Sucessfully")
        }
    }
    catch (err) {
        res.send("error" + err)
    };
})

//////////////////////////////// For Login User ////////////////////////////////
router.post('/signIn', async (req, res) => {
    try {
        let token;        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: "please field the data" });            
        }
        const userLogin = await User.findOne({ email: email, password: password });

        if (userLogin) {
            //Generate Token
            token = await userLogin.generateAuthToken();
            //Store the Token in Cookie
            res.cookie("jwtLogin", token, {
                expiresIn: new Date(Date.now() + 1 * 3600 * 1000),
                httpOnly: true
            })
            res.send(userLogin);
        } else {
            res.status(400).send({ error: "Invalid Credientials!"});
        }

    } catch (err) {
        console.log(err);
    }
})

//////////////////////////////// For Edit User ////////////////////////////////
router.get('/editUser/:id', authenticate, async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Update Edited User ////////////////////////////////
router.put('/updateUser/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const update= req.body;
        const employee = await User.findByIdAndUpdate(id, update, {new: true})

        res.send(employee)
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Delete User ////////////////////////////////
router.delete('/deleteUser/:email', authenticate, async (req, res) => {    
    try {
        if (req.authenticateUser.email === req.params.email) {
            req.clearCookie("jwtLogin")
        }
        await User.findOneAndDelete({email:req.params.email})
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Logout User ////////////////////////////////
router.get('/logout', authenticate, async (req, res) => {
    try {

        //Remove token from database
        req.authenticateUser.Token = req.authenticateUser.Token.filter((elem) => {
            return elem.token !== req.token
        })
        console.log(" req.authenticateUser.Token", req.authenticateUser.Token);

        //clear cookie
        res.clearCookie('jwtLogin');
        await req.authenticateUser.save();
        res.status(200).send("user Logout");
    }
    catch (err) {
        console.log('error');
        res.status(500).send(err);
    }
})

module.exports = router  