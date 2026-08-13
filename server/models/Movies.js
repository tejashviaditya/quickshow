import mongoose from "mongoose";
//we are importing the movies from the database and creating a schema for the movies
//why we doing importing mangoos? because we are using mongoose to connect to the database

const MoviesSchema = new mongoose.Schema({
    _id:{ type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    release_date: { type: String, required: true },
    original_language: { type: String },
    tagline: { type: String },
    genres: { type: Array,required: true },
    cast: { type: Array, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    runtime: { type: Number,required: true },
},{ timestamps: true });

const Movies = mongoose.model("Movies", MoviesSchema);
export default Movies;
