const express = require("express");
const router = express.Router();
router.use(logger);

router.get("/", (req, res) => {
  res.send("User List");
});

router.get("/new", (req, res) => {
  res.send("new user form");
});

router.post("/", (req, res) => {
  res.send("Create User");
});

router
  .route("/:id")
  .get((req, res) => {
    let id = req.params.id;
    console.log(req.user);
    res.send(`Get user With ID ${id}`);
  })
  .put((req, res) => {
    let id = req.params.id;
    res.send(`Update user With ID ${id}`);
  })
  .delete((req, res) => {
    let id = req.params.id;
    res.send(`Delete user With ID ${id}`);
  });

const users = [{ name: "sumit" }, { name: "sid" }];
router.param("id", (req, res, next, id) => {
  req.user = users[id];
  next();
});

function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

// router.get("/:id", (req, res) => {
//   let id = req.params.id;
//   res.send(`Get user With ID ${id}`);
// });

// router.put("/:id", (req, res) => {
//   let id = req.params.id;
//   res.send(`Update user With ID ${id}`);
// });

// router.delete("/:id", (req, res) => {
//   let id = req.params.id;
//   res.send(`Delete user With ID ${id}`);
// });

module.exports = router;
