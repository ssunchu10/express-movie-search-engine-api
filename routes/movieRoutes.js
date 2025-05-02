import {
  getHome,
  getMovies,
  createMovie,
} from "../controller/movieController.js";
import express from "express";

const router = express.Router();

router.get("/", getHome);
router.get("/movies", getMovies);
router.post("/create", createMovie);

export default router;
