# Movies-API
API to create and manage movie lists

## Usage
* clone repository using command `git clone https://github.com/Megxos/mimovies-api.git`
* `cd mimovies-api` to change directory into cloned folder
* run `npm install` to install all dependencies
* `cp sample.env .env` to copy enviroment variables from `sample.env` into a new file  called `.env`
* finally run `npm start` or `npm run dev` to start the developement server

## Endpoints
- [POST] `/register` - endpoint to register a new user account.
    * **Body**
        - `username`
        - `password`

- [POST] `/login` - endpoint to log into user account.
    * **Body**
        - `username`
        - `password`

- [GET] `/movies` - get list of random 200 movies.

- [GET] `/movies/list` - get all user lists

- [POST] `/movies/list/new` - create a new movie list
    * **Body**
        - `list_name`

- [POST] `/movies/list/movie` - add a movie to a list
    * **Body**
        - `list_name` (required)
        - `title` (required)
        - `genre` (optional)
        - `rating` (optional)
        - `year` (optional)

- [PUT] `/movies/list/movie/update/{movie_id}` - update movie details such as *rating*
    * **Params**
        - `movie_id`
    * **Body**
        - value(s) to update (rating, title, year, or genre)
        
- [DELETE] - `/movies/list/movie/delete/{movie_id}` - remove a movie from list
    * **Params**
        - `movie_id`