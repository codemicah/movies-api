require("dotenv").config();
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

module.exports.validate = async(req, user, next)=>{
    const token = req.headers["accessToken"];
    const reqUser = await jwt.verify(token, JWT_SECRET);
    if(reqUser){
        req.user = reqUser;
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "request not validated",
        error: {
            statusCode: 403,
            description: "an access token is required to validate your request"
        }
    });
};