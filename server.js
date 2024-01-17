const express = require("express");
const cors = require("cors");
const axios = require("axios");
const moment = require("moment");
const app = express();
const mysql = require("mysql2");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "movies-db",
});


app.get("/", (req, res) => {
  res.send("Hello this is Sumit's APi");

  connection.query("SELECT * from movies", (err, rows, fields) => {
    if (err) throw err;

    console.log("The solution is: ", rows);
    console.log("The solution is fields: ", fields);
  });
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
    const searchText = `SELECT movieId as id, title, description as overview, popularity, imagePath as poster_path,
    voteCount as vote_count, ReleaseDate as release_date, VoteAverage as vote_average  FROM movies WHERE title like '${query}%'`;
    console.log("The apiResponse is: ", apiResponse);

    connection.query(searchText, (err, rows, fields) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      console.log("The solution is fields: ", fields);

      const combinedData = {
        ...apiResponse.data,
        results: [...apiResponse.data.results, ...rows],
      };

      console.log("combinedData =>", combinedData);
      res.send(combinedData);
    });
  } catch (error) {}
});

app.post("/create", (req, res) => {
  try {
    console.log("Req Received =>", req.body);
    const eachMovie = req.body?.movieList[0];

    const date = eachMovie.movieReleaseDate;
    const unixDate = moment(date).unix();

    const insertQuery = `INSERT INTO movies (Title, description, Popularity, imagePath, VoteCount, ReleaseDate, VoteAverage)
    VALUES ('${eachMovie.movieTitle}', '${eachMovie.movieOverview}', '${eachMovie.moviePopularity}', 
    '${eachMovie.moviePosterPath}', '${eachMovie.movieVoteCount}', '${unixDate}', '${eachMovie.movieVoteAverage}');`;

    console.log("insertQuery =>", insertQuery);

    connection.query(insertQuery, (err, rows, fields) => {
      if (err) throw err;

      console.log("The solution is: ", rows);
      console.log("The solution is fields: ", fields);
      res.send("Successfully Created");
    });
  } catch (error) {
    console.error("Error creating movie: ", error);
  }
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});


// let movies = [];

// app.post("/create", (req, res) => {
//   try {
//     console.log("Req Received =>", req.body);
    // const newMoviesWhichBeCreated = req.body?.movieList.map((eachMovie) => {
    //   return {
    //     movieId: eachMovie.movieID,
    //     Title: eachMovie.movieTitle,
    //     Overview: eachMovie.movieOverview,
    //     Popularity: eachMovie.moviePopularity,
    //     PosterPath: eachMovie.moviePosterPath,
    //     VoteCount: eachMovie.movieVoteCount,
    //     ReleaseDate: eachMovie.movieReleaseDate,
    //     VoteAverage: eachMovie.movieVoteAverage,
    //   };
    // });
    // console.log("Data Received =>", newMoviesWhichBeCreated);
    // movies = [...movies, ...newMoviesWhichBeCreated];
    // console.log("Total Database =>", movies);
    // res.send(movies);
// })

// app.delete("/api/movies/:id", async (req, res) => {
//   try {
//     await Movie.findByIdAndRemove(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.set("view engine", "ejs");

// const userRouter = require("./routes/users");

// app.use("/users", userRouter);

// app.listen(8000);
