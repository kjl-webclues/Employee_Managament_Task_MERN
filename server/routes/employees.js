const express = require('express')
const router = express.Router()

const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')

const User = require('../model/employee')
const Country = require('../model/country')
const State = require('../model/state')
const City = require('../model/city')
const authenticate = require("../middleware/checkAuth")
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const { array } = require('../utils/multer')
const { log } = require('console')
// const { uploader } = require('../utils/cloudinary')
// const { type } = require('os')
// const { format } = require('path')
// const { Types } = require('mongoose')

//////////////////////////////// For Upload File ////////////////////////////////
router.post('/uploadFile', authenticate, upload.array("multi-files"), async (req, res) => {

  try {

        // console.log("req.files", req.files)
        const files = req.files;
        const invalidFileType = []
      for (const file of files) {
            
            // const { path } = file;
          const type = path.extname(file.originalname)
          if(type !== '.png' && type !== '.jpg' && type !== '.jpeg' && 
               type !== '.doc' && type !== '.docx' && type !== '.txt' &&
               type !== '.pdf' && type !== '.xml' && type !== '.gif'){

                invalidFileType.push(
                    file.originalname
                )
          } else {
                const uploadFiles = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' })

                const File = {
                fileName: file.originalname,
                filePath: uploadFiles.secure_url,
                // fileType: uploadFiles.format,
                fileType: type,
                public_Id: uploadFiles.public_id
            }

            // console.log("File", File);
            await User.updateOne({ email: req.authenticateUser.email }, { $push: { Files: File } });
          }
            
      }
      if (invalidFileType) {
          console.log("invalidFileType", invalidFileType)
            res.send(invalidFileType)
      } else {
            res.send({ msg: "File  Uploaded Succeessfully!! "});          
        }

    } catch (err) {
        res.status(400).send({ error: "File Not Upload" })

    }
})
//////////////////////////////// For Get Uploaded File ////////////////////////////////
router.get('/getListFile', authenticate, async (req, res) => {
    const page = req.query.page
    const limit = 6;
    let skip = (page - 1) * limit;
    let totalFiles = req.authenticateUser.Files;
    const aggregateQuery = [];
    const LoginUser = req.authenticateUser


    try {

        let totalPage = Math.ceil(totalFiles.length / limit);
        
        aggregateQuery.push(
            {
                $match: { Files: req.authenticateUser.Files }
            },
            {
                $project: {
                    _id: 0, getPage: { $slice: ["$Files", skip, limit] },
                }
            },
        );

        const files = await User.aggregate([aggregateQuery]);

        res.send({totalPage, files, LoginUser})
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Delete Uploaded File ////////////////////////////////
router.delete('/deleteFile', authenticate, async (req, res) => {
    try {
        const id = req.query.id
        
        const FileDelete = await cloudinary.uploader.destroy(id, { resource_type: "raw" })
        console.log("FileDelete", FileDelete);
        
        const deleteFile = await User.updateOne({ email: req.authenticateUser.email }, { $pull: { Files: { public_Id: id } } })
        console.log("deleteFile", deleteFile);

        res.send({msg: "Data Deleted Successfully"})
        
    } catch(error) {
        res.status(400).send({error: "File Not Deleted"})
    }
    
})

//////////////////////////////// For MultiDelete Uploaded File ////////////////////////////////
router.put('/deleteMultipleFile', authenticate, async (req, res) => {
    try {
        const files = req.body
        console.log("files", files);

        for (const file of files) {
            
            // const FileDelete = await cloudinary.uploader.destroy(file, { resource_type: "raw" })
            // console.log("FileDelete", FileDelete);
        
            const deleteFile = await User.updateOne({ email: req.authenticateUser.email }, { $pull: { Files: { public_Id: file } } })
            console.log("deleteFile", deleteFile);

        }
        res.send({ msg: "Data Deleted Successfully" })

        
    } catch(error) {
        res.status(400).send({error: "File Not Deleted"})
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

        //Details are filled properly
        if (!email || !password) {
            return res.status(400).send({ error: "please field the data" });
        }

        //user Exist
        const userLogin = await User.findOne({ email: email, password: password });

        if (userLogin) {

            //Generate Token
            token = await userLogin.generateAuthToken();

            //Store the Token in Cookie
            res.cookie("jwtLogin", token, {
                expiresIn: new Date(Date.now() + 1 * 3600 * 1000),
            })
            res.send({ msg: " user Login Successfully" });
        } else {
            res.status(400).send({ error: "Invalid Credientials!" });
        }

    } catch (err) {
        console.log(err);
    }
})

//////////////////////////////////// For Get User And Pagination/Requestin/sorting ///////////////////////////////////
router.get('/getUser', authenticate, async (req, res) => {
    try {
        const { page, sort, Request } = req.query
        const limit = 5
        let skip = (page - 1) * limit;
        const LoginUser = req.authenticateUser
        //console.log(LoginUser)
        const aggregateQuery = []


        /////////////////////////////////////// Get Data of Collections ///////////////////////////////
        //Get Country Collection  
        aggregateQuery.push(
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country"
                }
            })

        //Get State Collection
        aggregateQuery.push(
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "state"
                }
            })

        //Get City Collection
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
        if (Request !== "") {

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

            let totalPage = Math.ceil(matchUser.length / limit);

            aggregateQuery.push(
                //////////////////////////////// sorting ////////////////////////////////
                { $sort: { name: sort === "descending" ? -1 : 1 } },

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
            res.send({ users, totalPage, LoginUser });
        }
        else if (Request === "") {

            ////////////////////////////////// Count Total Documents ////////////////////////////////
            const total = await User.countDocuments({});

            ////////////////////////////////// Count Total Pages ////////////////////////////////
            let totalPage = Math.ceil(total / limit);

            aggregateQuery.push(

                ////////////////////////////////// sorting ////////////////////////////////
                { $sort: { name: sort === "descending" ? -1 : 1 } },

                ////////////////////////////////// Pagination ////////////////////////////////
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            )
            // console.log(aggregateQuery);
            ////////////////////////////////// Apply AggreagteQuery In User Collection ////////////////////////////////
            const users = await User.aggregate([aggregateQuery]);

            ////////////////////////////////// Send Response ////////////////////////////////
            res.send({ users, totalPage, LoginUser });
        }


    } catch (err) {
        res.send('Error' + err)
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
router.put('/updateUser/:id/:email', authenticate, async (req, res) => {
    try {

        //console.log(req.params);
        //console.log(req.body);
        const id = req.params.id;
        const updateValue = req.body;
        const email = req.params.email


        if (updateValue.email !== email) {
            const emailExist = await User.findOne({ email: updateValue.email });

            if (emailExist) {
                return res.status(400).send({ error: "Email already in use" })
            } else {
                await User.findByIdAndUpdate(id, updateValue, { new: true });
                res.json('Employee Updated Successfully!')
            }
        } else {
            await User.findByIdAndUpdate(id, updateValue, { new: true });
            res.json('Employee Updated Successfully!')
        }
    } catch (err) {
        res.send('Error' + err)
    }
})

//////////////////////////////// For Delete User ////////////////////////////////
router.delete('/deleteUser/:email', authenticate, async (req, res) => {
    //console.log(req.params.email);
    try {
        if (req.authenticateUser.email === req.params.email) {
            res.clearCookie('jwtLogin');

            const loginStatus = false

            await User.findOneAndDelete({ email: req.params.email })
            res.send(loginStatus)
        } else {
            const loginStatus = true

            await User.findOneAndDelete({ email: req.params.email });
            res.send(loginStatus)
        }

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
        aggregateQuery = [{
            $match: { "countryId": id }
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
        aggregateQuery = [{
            $match: { "stateId": id }
        }]

        const userData = await City.aggregate(aggregateQuery)
        res.send(userData)
    } catch (err) {
        res.send('Error' + err)
    }
})

// //////////////////////////////// For Check Cookie ////////////////////////////////

router.get('/checkCookie', async (req, res) => {
    try {
        if (req.cookies.jwtLogin) {
            const loginStatus = true;
            res.send({loginStatus})
        } else {
            const loginStatus = false;
            res.send({loginStatus})
        }
    } catch(error) {
        res.send(error)
    }
})

module.exports = router  