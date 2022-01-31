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

///////////////////////////////// For Get StateList ////////////////////////////////
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

//////////////////////////////// For Get StateList ////////////////////////////////
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

//////////////////////////////////// For Get User And Pagination/Searchin/Sorting ///////////////////////////////////
router.get('/getUser/:pageNumber/:Request', authenticate,async (req, res) => {
    try {
        const page = req.params.pageNumber
        const limit = 5
        const Request = req.params.Request
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
        
        //////////////////////////////// For Pagination ////////////////////////////////
        if (page) {
            aggregateQuery.push(
            { $skip: (page - 1) * limit }, { $limit: limit })
        }
        
        //////////////////////////////// For Sorting Data ////////////////////////////////
        if (Request === "asc" || Request === "dsc") {
            aggregateQuery.push(
                { $sort: { "name": Request === "asc" ? 1 : -1 } }                
            )
        }
        else {
            //////////////////////////////// For Searching Data ////////////////////////////////
            const search = Request
            aggregateQuery.push(
                {
                    $match: {
                        $or: [
                            { "name": RegExp("^" +search, "i")},
                            { "salary1": parseInt(search) },
                            { "salary2": parseInt(search) },
                            { "salary3": parseInt(search) },
                            { "country.countryName": RegExp("^" + search, "i") },
                            { "state.stateName": RegExp("^" + search, "i") },
                            { "city.cityName": RegExp("^" + search, "i") }                            
                        ]
                    }
                }
            )
        }
        const userData = await User.aggregate(aggregateQuery)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Register User ////////////////////////////////
router.post('/signUp', async (req, res) => {
    const user = new User({
        name: req.body.name,
        profession: req.body.profession,
        phone: req.body.phone,
        salary1: req.body.salary1,
        salary2: req.body.salary2,
        salary3: req.body.salary3,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        countryId: req.body.countryId,
        stateId: req.body.stateId,
        cityId: req.body.cityId,
        token: req.body.token
    })
    try {
        const userData = await user.save()
        res.send(userData)
    } catch (err) {
        res.send("Error" + err)
        console.log(err);
    }
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
router.delete('/deleteUser/:id', authenticate, async (req, res) => {
    try {
    res.clearCookie("jwtLogin")
    const userData = await User.findByIdAndDelete(req.params.id)
    res.json(userData)
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