var spicedPg = require("spiced-pg");
var bcrypt = require("bcryptjs");

const { dbUser, dbPassword } = require("./secrets");

const db = spicedPg(
    `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);

exports.insartNewUser = function insartNewUser(first, last, email, password) {
    const q = `
INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [
        first || null,
        last || null,
        email || null,
        password || null
    ];
    return db.query(q, params);
};
exports.hashPassword = function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.checkPassword = function checkPassword(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};

exports.insartSig = function insartSig(signature) {
    return db.query(
        `INSERT INTO signatures (signature) VALUES ($1) RETURNING id`,
        [signature]
    );
};
// exports.insartUserId = function insartUserId(signature) {
//     return db.query(
//         `INSERT INTO signatures (signature) VALUES ($1) RETURNING id`,
//         [signature]
//     );
// };

exports.thisUser = function thisUser(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.getNumber = function getNumber() {
    return db
        .query(`SELECT id FROM signatures ORDER BY id DESC LIMIT 1`)
        .then(num => {
            return num.rows[0].id;
        });
};
exports.allSupporter = function allSupporter() {
    return db.query(`SELECT first, last FROM signatures ORDER By id ASC`);
};

exports.getPic = function getPic(id) {
    return db
        .query(`SELECT signature FROM signatures WHERE id = $1`, [id])
        .then(sig => {
            return sig.rows[0].signature;
        });
};
