const router = require("express").Router(),
            moviesController = require("../controllers/movies.controller"),
            getMovie = require("../middleware/getMovies"),
            auth = require("../auth/auth");

router.get("/" , auth.validate, moviesController.getMovies);
router.post("/list/new" , auth.validate, moviesController.createList);
router.post("/list/movie" , auth.validate, moviesController.addMovie);
router.put("/list/movie/update/:movie_id" , auth.validate, moviesController.updateMovie);
router.delete("/list/movie/delete/:movie_id" , auth.validate, moviesController.removeMovie);

module.exports = router;