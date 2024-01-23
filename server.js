const express = require("express");
const cors = require("cors");
const axios = require("axios");
const moment = require("moment");
const mysql = require("mysql2");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "movies-db",
});

app.get("/", (req, res) => {
  res.send("Hi this is sumit from the server 2!");
});

app.get("/movies", async (req, res) => {
  try {
    const queryParams = req.query;
    console.log("Query Params =>", queryParams);
    let query = queryParams.query;
    let page = queryParams.page ? queryParams.page : 1;

    const apiResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=210c1a86f52296d71c06efcbac38c0c7`
    );
    // console.log("The apiResponse is: ", apiResponse);

    const searchText = `SELECT movieId as id, title, description as overview, popularity, imagePath as poster_path,
    voteCount as vote_count, ReleaseDate as release_date, VoteAverage as vote_average  FROM movies WHERE title like '${query}%'`;

    connection.query(searchText, (err, rows) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      // console.log("The solution is fields: ", fields);

      const formattedDateRows = rows.map((row) => ({
        ...row,
        release_date: moment.unix(row.release_date).format("YYYY-MM-DD"),
      }));

      console.log("Output of converted release date: ", formattedDateRows);
      // console.log("Number of movies from the database: ", formattedDateRows.length);

      const combinedData = {
        ...apiResponse.data,
        results: [...apiResponse.data.results, ...formattedDateRows],
        total_results: apiResponse.data.total_results + formattedDateRows.length,
      };

      console.log("combinedData =>", combinedData);
      res.send(combinedData);
    });
  } catch (error) {}
});

app.post("/create", (req, res) => {
  try {
    const movies = req.body?.movieList[0];

    const date = movies.movieReleaseDate;
    const unixDate = moment(date).valueOf();

    const insertMovies = `INSERT INTO movies (title, description, popularity, imagePath, voteCount, releaseDate, voteAverage)
        VALUES ('${movies.movieTitle}', '${movies.movieOverview}', '${movies.moviePopularity}', 
             '${movies.moviePosterPath}', '${movies.movieVoteCount}', '${unixDate}', '${movies.movieVoteAverage}');`;

    console.log("insertQuery =>", insertMovies);

    connection.query(insertMovies, (err, createdMovie) => {
      if (err) throw err;

      console.log("The created movie are: ", createdMovie);
    });
    if (movies.movieTitle.length > 2) {
      res.status(200).send("successfuly created");
    }
  } catch (error) {
    console.error("Error creating movie: ", error);
  }
});

app.post("/delete", (req, res) => {
  try {
    const movies = req.body?.movieList[0];

    console.log("ID to be deleted: ", movies.movieID);

    const deleteMovie = `DELETE FROM movies WHERE movieId = ${movies.movieID};`;

    connection.query(deleteMovie, (err, deletedMovie) => {
      if (err) throw err;
      console.log("Deleted Movie: ", deletedMovie);
    });

    if (movies.movieID > 0) {
      res.status(200).send("successfuly created");
    }
  } catch (error) {
    console.log("Error Deleteing the movie: ", error);
  }
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
