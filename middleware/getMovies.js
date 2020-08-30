const request = require("request");

module.exports.getMovie = async (req, res, next)=>{
    let movies = [];

    async function redo(moviesLength){
        let movieId = Math.round(Math.random() * 1000);
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=c73f38a0e70efb245855382c4ecaf641&language=en-US`;
        await request(url, async (error, response, body) => {
            if (body) {
                await movies.push(body);
                console.log(movies.length)
                if (movies.length == 200) {
                    req.movies = await movies;
                    next();
                }else{
                    redo(moviesLength + 1);
                }
            }
        });
    }
    redo(0);
};