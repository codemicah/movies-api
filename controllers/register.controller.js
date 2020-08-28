require("dotenv").config();
const userModel = require("../models/user"),
            bcrypt = require("bcryptjs"),
            jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
module.exports.register = async(req, res)=>{
    //get required body
    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(400).json({
            success: false,
            message: "incorrect credentials",
            error: {
                statusCode: 400,
                description: "username and password are both required"
            }
        });
    }

    //make sure username is not taken
    const user = await userModel.findOne({ username });

    if (user) return res.status(409).json({
        success: false,
        message: "user already exists",
        error: {
            statusCode: 409,
            description: "A user with the given username is already registered"
        }
    });

    //proceed if username is free
    //hash password
    password = await bcrypt.hash(password, 10);
    //generate an access token
    const accessToken = await jwt.sign({
        username
    }, JWT_SECRET);

    const newUser = new userModel({
        username,
        password,
        accessToken
    });
    await userModel.create(newUser).then((success)=>{
        return res.status(201).json({
            success: false,
            message: "user registration successfull",
            data: {
                statusCode: 201,
                description: "user account was successfully created",
                data: success
            }
        });
    }).catch((error)=>{
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                statusCode: 500,
                description: "could not create user account"
            }
        });
    });
};