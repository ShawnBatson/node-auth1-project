const bcrypt = require("bcryptjs");

const router = express.Router();

const Users = require("../users/users_model");

router.post("/register", (req, res) => {
    const userInfo = req.body;
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);
    userInfo.password = hash;
    Users.add(userInfo)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.status(401).json({ message: "error" });
        });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    Users.findBy({ username })
        .then(([user]) => {
            console.log("user", user);
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                };

                res.status(200).json({ hello: user.username });
            } else {
                res.status(400).json({ message: "invalid credentials" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: "error" });
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(); //I didn't want to put the callback here, it looked clunky. I left it out
    } else {
        res.status(200).json({ message: "You weren't logged in" });
    }
});
module.exports = router;
