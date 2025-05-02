import {
  getHome,
  getMovies,
  createMovie,
  deleteMovie
} from "../controller/movieController.js";
import express from "express";

const router = express.Router();

router.get("/", getHome);
router.get("/movies", getMovies);
router.post("/create", createMovie);
router.post("/delete", deleteMovie);

export default router;
