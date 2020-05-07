const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const config = require("./database/config");

const userRouter = require("./users/users_router");
const authRouter = require("./auth/auth_router");
const restricted = require("./auth/restricted-middleware");

const server = express();

const sessionConfig = {
    name: "Keebler",
    secret: "Elves are from eberon",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false, //change to true if production is active
        httpOnly: true,
    },
    resave: false,
    saveUntilInitialized: true,

    store: new KnexSessionStore({
        knex: config,
        createTable: true,
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/users", restricted, userRouter);
server.use("/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ Welcome: "to the api!" });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
