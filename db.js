var spicedPg = require("spiced-pg");
var bcrypt = require("bcryptjs");

const { dbUser, dbPassword } = require("./secrets");

const db = spicedPg(
    `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);

exports.insertNewUser = function insertNewUser(first, last, email, password) {
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

exports.insertSig = function insertSig(signature, user_id) {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id`,
        [signature, user_id]
    );
};

exports.thisUser = function thisUser(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.getPic = function getPic(id) {
    return db
        .query(`SELECT signature FROM signatures WHERE id = $1`, [id])
        .then(sig => {
            return sig.rows[0].signature;
        });
};

exports.insertNewProfile = function insertNewProfile(age, city, url, user_id) {
    const q = `
INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [age || null, city || null, url || null, user_id];
    return db.query(q, params);
};

// exports.getNumber = function getNumber() {
//     return db
//         .query(`SELECT id FROM signatures ORDER BY id DESC LIMIT 1`)
//         .then(num => {
//             return num.rows[0].id;
//         });
// };
exports.allSupporter = function allSupporter() {
    return db.query(`SELECT users.first AS first_name, users.last AS last_name, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
FROM signatures
JOIN users
ON signatures.user_id = users.id
LEFT JOIN user_profiles
ON signatures.user_id = user_profiles.user_id`);
};
