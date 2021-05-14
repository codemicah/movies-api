const router = require("express").Router();
const moviesController = require("../controllers/movies.controller");
const auth = require("../auth/auth");

router.get("/", auth.validate, moviesController.getMovies);

router.get("/list", auth.validate, moviesController.getLists);

router.post("/list/new", auth.validate, moviesController.createList);

router.post("/list/movie", auth.validate, moviesController.addMovie);

router.put(
  "/list/movie/update/:movie_id",
  auth.validate,
  moviesController.updateMovie
);

router.delete(
  "/list/movie/delete/:movie_id",
  auth.validate,
  moviesController.removeMovie
);

module.exports = router;
