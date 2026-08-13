//Iska kaam hai TMDB API se movies lana aur frontend me now playing ko bhejna jo hai admin dashboard me

import axios from 'axios'; //ek library hai jo kisi bhi API(https) ko request bhejne ke liye use hoti hai.
import Movies from "../models/Movies.js";
import Show from "../models/Show.js"; // its about the show time and data 






export const getNowPlayingMovies = async (req, res) => {
    try {
        // Fetch standard now playing movies
        const nowPlayingPromise = axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        // Fetch popular Hindi movies
        const hindiDiscoverPromise = axios.get('https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc', {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        const [nowPlayingRes, hindiDiscoverRes] = await Promise.all([nowPlayingPromise, hindiDiscoverPromise]);

        const standardMovies = nowPlayingRes.data.results || [];
        const hindiMovies = hindiDiscoverRes.data.results || [];

        // Combine standard and Hindi movies, keeping unique IDs
        const combinedMap = new Map();
        
        standardMovies.forEach(movie => {
            combinedMap.set(movie.id, movie);
        });

        hindiMovies.forEach(movie => {
            if (!combinedMap.has(movie.id)) {
                combinedMap.set(movie.id, movie);
            }
        });

        const uniqueMovies = Array.from(combinedMap.values());

        res.json({ success: true, movies: uniqueMovies });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Api to add new shows to the dashboard

export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body; 

        let movie = await Movies.findById(movieId); //backend is finding the mivie in mongo db for specific movieId
        if (!movie) { //if the movie is not found 


            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([ //Promise.all is used to make multiple requests at the same time

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, { //it will provide the details of the movie
                    headers: { 
                        'Authorization': `Bearer ${process.env.TMDB_API_KEY}` //it is for to identify the user and give the access to the API.
                    }
                })
                , axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, { // it will provide the cast and crew details of the movie
                    headers: {
                        'Authorization': `Bearer ${process.env.TMDB_API_KEY}` 
                    }
                })
            ]);
            
            const movieApiData = movieDetailsResponse.data;
            const movieCast = movieCreditsResponse.data.cast;

// ham apne hisab se object banayenge kue ki tmdb ka response bahut bada hota hai
           const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path, 
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline,
                genres: movieApiData.genres,
                cast: movieCast,
                vote_average: movieApiData.vote_average,
                vote_count: movieApiData.vote_count,
                runtime: movieApiData.runtime
            }

            //add movie to the database
            movie = new Movies(movieDetails); //it is only memory not saved in the mongodb 
            await movie.save();



        }

  //empty array to store the shows which we are going to create


        const showsToCreate = [];
        showsInput.forEach(show => {   //it is iterating over the shows which we are getting from the frontend and for each one by one
            const time=show.time;
            const showDate = show.date;
            
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({ // pushing the shows to the array which we are going to create
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice: showPrice,
                    occupiedSeats:{}
                });
            });
       
        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);  //ek sath me multiple shows ko insert karne ke liye use hota hai mongo db pr, api call ko reduce krne ke liye 
            res.json({ success: true, message: "Shows added successfully" });   //showsToCreate is the array of shows which we are inserting in the database

        } 
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get all the shows from the database
export const getShows = async (req, res) => {
    try {
        //we are using populate to get the movie details from the database
        const shows = await Show.find({showDateTime:{$gte:new Date()}}).populate("movie").sort({showDateTime:1}); 
        //filter the unique movies
        const uniqueMoviesMap = {};
        shows.forEach(show => {
            if (show.movie && show.movie._id) {
                uniqueMoviesMap[show.movie._id] = show.movie;
            }
        });
        res.json({ success: true, shows: Object.values(uniqueMoviesMap) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// api to get single show from the database
export const getShow = async (req, res) => {
    try {

        const {movieId} = req.params; //getting the movieId from the frontend
        //get all upcoming shows for the movie
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })

        const movie = await Movies.findById(movieId); //getting the movie details from the database
        const dateTime={}
        shows.forEach(show=>{
            const data=show.showDateTime.toISOString().split('T')[0]; //splitting the date and time from the showDateTime
            if(!dateTime[data]){
                dateTime[data]=[];
            }
            dateTime[data].push({time:show.showDateTime,showId:show._id})
        })

        let trailerUrl = "";
        try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                headers: {
                    'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
                }
            });
            const trailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer");
            if (trailer) {
                trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
            } else if (data.results && data.results.length > 0) {
                const ytVideo = data.results.find(video => video.site === "YouTube");
                if (ytVideo) {
                    trailerUrl = `https://www.youtube.com/watch?v=${ytVideo.key}`;
                }
            }
        } catch (err) {
            console.log("Error fetching trailer from TMDB:", err.message);
        }

        res.json({ success: true, movie, dateTime, trailerUrl });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }   

}


           
 
