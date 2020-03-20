const express = require("express");

const User = require("./userDb");
const Post = require("../posts/postDb");

const router = express.Router();

//working...
//adds a new user
router.post("/", validateUser, async (req, res) => {
  // do your magic!
  try {
    const addUser = await User.insert(req.body);
    res.status(201).json(addUser);
  } catch (err) {
    next(err);
  }
});

//adds a text post to a user
router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  // do your magic!
  const { id } = req.params;
  req.body.user_id = id;
  try {
    const addPostToUser = await Post.insert(req.body);
    res.status(201).json(addPostToUser);
  } catch (err) {
    next(err);
  }
});

//working...
router.get("/", async (req, res, next) => {
  // do your magic!
  try {
    const getAllUsers = await User.get(req.body);
    res.status(200).json(getAllUsers);
  } catch (err) {
    next(err);
  }
});

//working...
router.get("/:id", validateUserId, async (req, res, next) => {
  // do your magic!
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
});

//working...
router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // do your magic!
  try {
    const getSpecificPost = await User.getUserPosts(req.user.id);
    res.status(200).json(getSpecificPost);
  } catch (err) {
    next(err);
  }
  // User.getUserPosts(req.user.id)
  //   .then(post => {
  //     res.status(200).json(post);
  //   })
  //   .catch(error => {
  //     res.status(500).json({ error: "Error with getting the user posts." });
  //   });
});

//working...
router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  User.remove(req.user.id).then(removePost => {
    res.status(200).json(removePost);
  });
});

//working...
router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  User.update(req.user.id, req.body)
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(error => {
      res.status(500).json({ error: "Error updating user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id).then(userId => {
    if (userId) {
      req.user = userId;
      next();
    } else {
      res.status(404).json({ message: "invalid user id" });
    }
  });
}

function validateUser(req, res, next) {
  // do your magic!
  const userBody = req.body;
  if (Object.keys(userBody).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!userBody.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const postBody = req.body;
  if (Object.keys(postBody).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!postBody.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
