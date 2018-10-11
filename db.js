var spicedPg = require("spiced-pg");
var bcrypt = require("bcryptjs");

const { dbUser, dbPassword } = require("./secrets");

const db = spicedPg(
    `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);

var dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`;

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

exports.getFullProfileByEmail = function getFullProfileByEmail(email) {
    return db.query(
        `SELECT users.first AS first_name, signatures.id AS sig,users.id AS id, users.password AS password, users.last AS last_name, users.email AS email, signatures.signature AS signature, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
FROM signatures
JOIN users
ON signatures.user_id = users.id
LEFT JOIN user_profiles
ON signatures.user_id = user_profiles.user_id
WHERE users.email = $1`,
        [email]
    );
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

exports.getNumber = function() {
    return db
        .query(`SELECT COUNT (*) FROM signatures`)
        .then(result => {
            return result.rows[0].count;
        })
        .catch(function(err) {
            console.log(err);
        });
};
exports.removeSig = function(id) {
    const q = `
    DELETE FROM signatures
    WHERE user_id = $1;
    `;
    const params = [id || null];

    return db.query(q, params);
};

exports.allSupporter = function allSupporter() {
    return db.query(`SELECT users.first AS first_name, users.last AS last_name, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
FROM signatures
JOIN users
ON signatures.user_id = users.id
LEFT JOIN user_profiles
ON signatures.user_id = user_profiles.user_id`);
};

exports.allSupporterByCity = function(city) {
    return db.query(
        `SELECT users.first AS first_name, users.last AS last_name, user_profiles.user_id,user_profiles.age AS age, user_profiles.url AS url
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        WHERE LOWER(city) = LOWER($1);
        `,
        [city]
    );
};
exports.getFullProfile = function getFullProfile(id) {
    return db.query(
        `SELECT users.first AS first_name, users.last AS last_name, users.email AS email,signatures.signature AS signature, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
FROM signatures
JOIN users
ON signatures.user_id = users.id
LEFT JOIN user_profiles
ON signatures.user_id = user_profiles.user_id
WHERE user_profiles.user_id = $1`,
        [id]
    );
};
exports.updateUserOneWith = function(id, first, last, email, hashPassword) {
    const q = `
    UPDATE users
    SET first = $2, last = $3, email = $4, password = $5
    WHERE id = $1;
    `;
    const params = [
        id || null,
        first || null,
        last || null,
        email || null,
        hashPassword || null
    ];

    return db.query(q, params);
};

exports.updateUserOne = function(id, first, last, email) {
    const q = `
    UPDATE users
    SET first = $2, last = $3, email = $4
    WHERE id = $1;
    `;
    const params = [id || null, first || null, last || null, email || null];

    return db.query(q, params);
};

exports.updateUserTwo = function(id, age, city, url) {
    const q = `
    INSERT INTO user_profiles (user_id, age, city, url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET user_id = $1, age = $2, city = $3, url = $4;
    `;
    const params = [id || null, age || null, city || null, url || null];

    return db.query(q, params);
};
