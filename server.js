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
// app.use(registerRoute);
// app.use(loginRoute);
// app.use(moviesRoute);

const port = process.env.PORT || LOCAL_PORT;
app.listen(port, ()=>{
    console.log(`server running on PORT *:${port}`);
});