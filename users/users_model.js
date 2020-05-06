const db = require("../database/config");

function find() {
    return db("users").select("id", "username");
}

function findBy(filter) {
    return db("users").where(filter);
}

async function add(user) {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
}

function finById(id) {
    return db("users")
        .select("id", "username", "password")
        .where({ id })
        .first();
}

module.exports = {
    add,
    find,
    findBy,
    findById,
};
