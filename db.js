var spicedPg = require("spiced-pg");

// var db = spicedPg('postgres:spicedling:password@localhost:5432/cities');
//
// db.query('SELECT * FROM cities').then(function(results) {
//     console.log(results.rows);
// }).catch(function(err) {
//     console.log(err);
// });

exports.insertSign = function insertSign(first, last, signature, time) {
    return db.query(
        `INSERT INTO signatures (first, last, signature, time) VALUES ($1, $2, $3);`,
        [firstName, lastName, signature, Date()]
    );
};
