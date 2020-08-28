require("dotenv").config();
const express = require("express"),
            database = require("./config/database"),
            bodyParser = require("body-parser");

//initialize enviroment variables
const { LOCAL_PORT } = process.env;

//connect to database
database.connect();

//express configurations
const app = express();
app.use(bodyParser.urlencoded({ extended:true }));

//import all routes
const registerRoute = require("./routes/register"),
            loginRoute = require("./routes/login"),
            moviesRoute = require("./routes/movies");


//attach routes to server
app.use(registerRoute);
app.use(loginRoute);
// app.use(moviesRoute);

app.get("/", (req, res)=>{
    return res.status(200).json({
        success: true,
        message: "movies-api",
        data: {
            statusCode: 200,
            description: "movies-api root route"
        }
    });
});

app.get("*", (req, res)=>{
    return res.status(404).json({
        success: false,
        message: "route not found",
        error: {
            statusCode: 404,
            description: "you reached a route that is not defined on this server"
        }
    });
});

app.post("*", (req, res)=>{
    return res.status(404).json({
        success: false,
        message: "route not found",
        error: {
            statusCode: 404,
            description: "you reached a route that is not defined on this server"
        }
    });
});


const port = process.env.PORT || LOCAL_PORT;
app.listen(port, ()=>{
    console.log(`server running on PORT *:${port}`);
});