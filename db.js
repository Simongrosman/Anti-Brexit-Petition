console.log("works");
var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:password@localhost:5432/signatures");

// db.query("SELECT * FROM cities")
//     .then(function(results) {
//         console.log(results.rows);
//     })
//     .catch(function(err) {
//         console.log(err);
//     });

exports.insartData = function insartData(first, last, signature) {
    console.log("IM IN GETDATA1");
    return db.query(
        `INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3);`,
        [first, last, signature]
    );
};

exports.getNumber = function getNumber() {
    return db.query(`SELECT id FROM save ORDER BY id DESC LIMIT 1`);
};
