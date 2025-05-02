// services/movieService.js
import axios from "axios";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const getAllMovies = (callback) => {
  connection.query("SELECT * FROM movies", callback);
};

const getMoviesFromDB = (query, callback) => {
  const searchText = `SELECT movieId as id, title, description as overview, popularity, imagePath as poster_path,
    voteCount as vote_count, ReleaseDate as release_date, VoteAverage as vote_average
    FROM movies WHERE title LIKE '${query}%'`;
  connection.query(searchText, callback);
};

const fetchMoviesFromAPI = async (query, page) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=210c1a86f52296d71c06efcbac38c0c7`
  );
  return response.data;
};

const insertMovie = (movie, callback) => {
  const insertQuery = `INSERT INTO movies 
(Title, description, Popularity, imagePath, VoteCount, ReleaseDate, VoteAverage)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    movie.movieTitle,
    movie.movieOverview,
    movie.moviePopularity,
    movie.moviePosterPath,
    movie.movieVoteCount,
    movie.movieReleaseDate, 
    movie.movieVoteAverage,
  ];

  connection.query(insertQuery, values, callback);
};

export default {
  getAllMovies,
  getMoviesFromDB,
  fetchMoviesFromAPI,
  insertMovie,
};
