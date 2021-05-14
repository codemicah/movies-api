const request = require("request");
const listModel = require("../models/movie_list");
const movieModel = require("../models/movie");

const { TMDB_API_KEY } = process.env;

module.exports.getMovies = async (req, res) => {
  let movies = [];

  //recursive function stops when 200 movies are retrieved
  async function redo(moviesLength) {
    let movieId = Math.round(Math.random() * 1000);
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`;
    request(url, async (error, response, body) => {
      if (body) {
        body = JSON.parse(body);
        await body.results.map((movie) => {
          movies.push(movie);
        });
        if (movies.length == 200) {
          req.movies = await movies;
          res.status(200).json({
            success: true,
            message: "successfully retrieved movies",
            total: movies.length,
            data: {
              statusCode: 200,
              description: "list of 200 popular movies",
              movies,
            },
          });
        } else {
          redo(moviesLength + 1);
        }
      }
    });
  }
  redo(0);
};

module.exports.createList = async (req, res) => {
  const listname = req.body.list_name;
  const currentUser = req.user.user_id;

  if (!listname)
    return res.status(400).json({
      success: false,
      message: "invalid list name",
      error: {
        statusCode: 400,
        description: "list name is required",
      },
    });

  listModel.find({ name: listname }, async (error, movieList) => {
    if (
      movieList &&
      movieList.filter((list) => list.user_ref_id.equals(currentUser)).length >
        0
    ) {
      return res.status(409).json({
        success: false,
        message: "list already exists",
        error: {
          statusCode: 409,
          description: "a list with the given name already exists",
        },
      });
    } else {
      const list = await listModel.create({
        name: listname,
        user_ref_id: currentUser,
      });

      if (!list)
        return res.status(500).json({
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
          list,
        },
      });
    }
  });
};

module.exports.getLists = async (req, res) => {
  const currentUser = req.user.user_id;
  const lists = await listModel.find({});
  const movies = await movieModel.find({});

  if (!lists)
    return res.status(404).json({
      success: false,
      message: "list not found",
      error: {
        statusCode: 404,
        description: "no list found with the given name",
      },
    });
  let userLists = [];
  lists.filter((list) => {
    if (list.user_ref_id.equals(currentUser)) {
      let allMovies = [];
      movies.filter((movie) => {
        if (movie.list_ref_id.equals(list._id)) {
          allMovies.push(movie);
        }
      });
      userLists.push({ list, movies: allMovies });
    }
  });
  res.status(200).json({
    success: true,
    message: "user lists",
    data: {
      statusCode: 200,
      description: "successfully retrieved user lists",
      lists: userLists,
    },
  });
};

module.exports.addMovie = async (req, res) => {
  const reqBody = req.body;
  const listname = reqBody.list_name,
    title = reqBody.title,
    year = reqBody.year,
    genre = reqBody.genre,
    rating = reqBody.rating;
  const currentUser = req.user.user_id;

  //validate required body
  if (!listname || !title)
    return res.status(400).json({
      success: false,
      message: "invalid request",
      error: {
        statusCode: 400,
        description: "list name and movie title are required",
      },
    });

  listModel
    .findOne({ name: listname })
    .then(async (movieList) => {
      const movie = {
        title,
        year,
        genre,
        rating,
        list_ref_id: movieList._id,
        user_ref_id: currentUser,
      };

      const newMovie = await movieModel.create(movie);
      if (!newMovie)
        return res.status(500).json({
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
          newMovie,
        },
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: "list not found",
        error: {
          statusCode: 404,
          description: "no list found with the given name",
        },
      });
    });
};

module.exports.updateMovie = async (req, res) => {
  const reqBody = req.body;
  const { rating, title, genre, year } = reqBody;
  const movie_id = req.params.movie_id;

  // validate required body
  if (!reqBody) {
    return res.status(400).json({
      success: false,
      message: "invalid values",
      error: {
        statusCode: 400,
        description: "nothing to update",
      },
    });
    //rating must ne a number
  } else if (rating && !Number(rating)) {
    return res.status(400).json({
      success: false,
      message: "invalid rating",
      error: {
        statusCode: 400,
        description: "new rating must be a number",
      },
    });
    //rating must be between 1 and 5
  } else if (Number(rating) > 5) {
    return res.status(400).json({
      success: false,
      message: "invalid rating",
      error: {
        statusCode: 400,
        description: "movie rating must be between 1 and 5",
      },
    });
  }
  movieModel
    .findById(movie_id)
    .then(async (movie) => {
      movie.title = title || movie.title;
      movie.year = year || movie.year;
      movie.genre = genre || movie.genre;
      movie.rating = rating || movie.rating;

      const updatedMovie = await movie.save();

      if (updatedMovie)
        return res.status(200).json({
          success: true,
          message: "movie updated successfully",
          data: {
            statusCode: 200,
            description: "movie updated successfully",
            updatedMovie,
          },
        });

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: {
          statusCode: 500,
          description: "could not update movie",
        },
      });
    })
    .catch((error) => {
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

//remove movie from list
module.exports.removeMovie = async (req, res) => {
  const movie_id = req.params.movie_id;
  const currentUser = req.user.user_id;

  movieModel
    .findById(movie_id)
    .then(async (movie) => {
      //make sure correct user is making request
      if (movie.user_ref_id.equals(currentUser)) {
        const removedMovie = await movie.remove();
        if (removedMovie)
          return res.status(200).json({
            success: true,
            message: "movie removed successfully",
            data: {
              statusCode: 200,
              description: "movie removed successfully",
              removedMovie,
            },
          });
        //if movie was not removed
        return res.status(500).json({
          success: false,
          message: "internal server error",
          error: {
            statusCode: 500,
            description: "could not remove that movie",
            removedMovie,
          },
        });
      }
      return res.status(403).json({
        success: false,
        message: "forbidden",
        error: {
          statusCode: 403,
          description: "you cannot remove this movie",
          removedMovie,
        },
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: "movie not found",
        error: {
          statusCode: 404,
          description: "movie does not exist",
        },
      });
    });
};
