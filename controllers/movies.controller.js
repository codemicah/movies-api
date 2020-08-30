require("dotenv").config();
const request = require("request"),
            listModel = require("../models/movie_list"),
            movieModel = require("../models/movie");

const { TMDB_API_KEY } = process.env;

module.exports.getMovies  = async(req, res)=>{

    let movies = [];

    async function redo(moviesLength) {
        let movieId = Math.round(Math.random() * 1000);
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=c73f38a0e70efb245855382c4ecaf641&language=en-US`;
        await request(url, async (error, response, body) => {
            if (body) {
                await movies.push(body);
                return res.send(body);
                if (movies.length == 200) {
                    req.movies = await movies;
                    res.end();
                } else {
                    redo(moviesLength + 1);
                }
            }
        });
    }
    redo(0);
};

module.exports.createList = async(req, res)=>{
    const listname = req.body.list_name;

    if(!listname) return res.status(400).json({
      success: false,
      message: "invalid list name",
      error: {
        statusCode: 400,
        description: "list name is required",
      },
    });
    listModel.findOne({ name: listname }, async(error, movieList)=>{
        if (movieList) return res.status(409).json({
            success: false,
            message: "list already exists",
            error: {
                statusCode: 409,
                description: "a list with the given name already exists",
            },
        });
        const list = await listModel.create({
            name: listname
        });
        if (!list) return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                statusCode: 500,
                description: "internal server error",
            },
        });
        return res.status(201).json({
            success: true,
            message: "movie list created successfully",
            data: {
                statusCode: 201,
                description: "movie list created successfully",
                list
            },
        });
    });    
};

module.exports.addMovie = async(req, res)=>{
    const reqBody = req.body;
    const listname = reqBody.list_name,
                title = reqBody.title,
                year = reqBody.year,
                genre = reqBody.genre,
                rating = reqBody.rating;
    const currentUser = req.user.user_id;

    //validate required body
    if (!listname || !title) return res.status(400).json({
        success: false,
        message: "invalid request",
        error: {
            statusCode: 400,
            description: "list name and movie title are required",
        },
    });

    listModel.findOne({ name:  listname}).then( async(movieList)=>{
        const movie = {
            title,
            year,
            genre,
            rating,
            list_ref_id: movieList._id,
            user_ref_id: currentUser
        };
        
        const newMovie = await movieModel.create(movie);
        if (!newMovie) return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                statusCode: 500,
                description: "internal server error",
            },
        });

        return res.status(201).json({
            success: true,
            message: "movie added to list successfully",
            data: {
                statusCode: 201,
                description: "movie added to list successfully",
                newMovie
            },
        });
    });
};

module.exports.updateMovie = async(req, res)=>{
    const reqBody = req.body;
    const rating = reqBody.rating;
    const movie_id = req.params.movie_id;

    if (!rating){
        return res.status(400).json({
            success: false,
            message: "invalid rating",
            error: {
                statusCode: 400,
                description: "new rating is required",
            },
        });
    }else if(! Number(rating)){
        return res.status(400).json({
            success: false,
            message: "invalid rating",
            error: {
                statusCode: 400,
                description: "new rating must be a number",
            },
        });
    }else if(Number(rating) > 5){
        return res.status(400).json({
            success: false,
            message: "invalid rating",
            error: {
                statusCode: 400,
                description: "movie rating must be between 1 and 5",
            },
        });
    }

    movieModel.findByIdAndUpdate(movie_id, { rating }, { new: true, useFindAndModify: false}).then(updatedMovie=>{
        return res.status(200).json({
            success: true,
            message: "movie updated successfully",
            data: {
                statusCode: 200,
                description: "movie updated successfully",
                updatedMovie
            },
        });
    }).catch(error=>{
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                statusCode: 500,
                description: "could not update movie",
            },
        });
    });
};
