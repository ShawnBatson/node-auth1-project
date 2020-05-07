const express = require("express");

const router = express.Router();

const Users = require("./users_model");

router.get("/", (req, res) => {
    Users.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(401).json({ message: "You've encountered an error" });
        });
});

module.exports = router;
