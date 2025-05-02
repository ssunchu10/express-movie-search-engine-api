import movieService from "../services/movieService.js";
import moment from "moment";

export const getHome = (req, res) => {
  res.send("Hello this is Sumit's API");
  movieService.getAllMovies((err, rows) => {
    if (err) throw err;
    console.log("The solution is: ", rows);
  });
};

export const getMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    const apiData = await movieService.fetchMoviesFromAPI(query, page);

    movieService.getMoviesFromDB(query, (err, dbMovies) => {
      if (err) throw err;

      const formattedDBMovies = dbMovies.map((movie) => ({
        ...movie,
        release_date: moment.unix(movie.release_date).format("YYYY-MM-DD"),
      }));

      const combinedData = {
        ...apiData,
        results: [...apiData.results, ...formattedDBMovies],
      };

      res.send(combinedData);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const createMovie = (req, res) => {
  try {
    const movie = req.body?.movieList[0];
    movieService.insertMovie(movie, (err, result) => {
      if (err) throw err;
      res.send("Successfully Created");
    });
  } catch (err) {
    console.error("Error creating movie: ", err);
    res.status(500).send("Error creating movie");
  }
};

export const deleteMovie = (req, res) => {
  try {
    const movieId = req.body?.movieList[0]?.movieID;

    if (!movieId) {
      return res.status(400).send("Missing movie ID");
    }

    movieService.deleteMovie(movieId, (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        return res.status(404).send("Movie not found");
      }

      res.send("Successfully Deleted");
    });
  } catch (err) {
    console.error("Error deleting movie: ", err);
    res.status(500).send("Error deleting movie");
  }
};

