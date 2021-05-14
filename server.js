require("dotenv").config();
const express = require("express");
const database = require("./config/database");

//initialize enviroment variables
const { LOCAL_PORT } = process.env;

//connect to database
database.connect();

//express configurations
const app = express();
app.use(express.json());

//import all routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const moviesRoute = require("./routes/movies");

//attach routes to server
app.use(registerRoute);
app.use(loginRoute);
app.use("/movies", moviesRoute);

app.get("/", (req, res) => {
  res.redirect("https://github.com/Megxos/movies-api/blob/master/README.md");
});

app.get("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "route not found",
    error: {
      statusCode: 404,
      description: "you reached a route that is not defined on this server",
    },
  });
});

app.post("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "route not found",
    error: {
      statusCode: 404,
      description: "you reached a route that is not defined on this server",
    },
  });
});

const port = process.env.PORT || LOCAL_PORT;
app.listen(port, () => {
  console.log(`server running on PORT *:${port}`);
});
