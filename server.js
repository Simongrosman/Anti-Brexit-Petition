const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
var bcrypt = require("bcryptjs");
const db = require("./db.js");
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(csurf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(express.static("public"));

function checkForUser(req, res, next) {
    if (!req.session.user) {
        next();
    } else {
        res.redirect("/sign");
    }
}
function checkForsig(req, res, next) {
    if (!req.session.signatureId) {
        next();
    } else {
        res.redirect("/thanks");
    }
}

app.get("/", checkForUser, (req, res) => {
    res.redirect("/register");
});

app.get("/register", checkForUser, (req, res) => {
    res.render("registerview", {
        layout: "mainlay",
        title: "Simon's Petition"
    });
});
app.post("/register", (req, res) => {
    db.hashPassword(req.body.password).then(hash => {
        db.insertNewUser(
            req.body.first,
            req.body.last,
            req.body.email,
            hash
        ).then(result => {
            req.session.user = result["rows"][0].id;
            req.session.first = result["rows"][0].first;
            req.session.last = result["rows"][0].last;
            res.redirect("/profile");
        });
    });
});

///////////////////signing //////////////////
app.get("/sign", checkForsig, (req, res) => {
    res.render("mainview", {
        layout: "mainlay",
        title: "Simon's Petition",
        first: req.session.first,
        last: req.session.last
    });
});
/////////////////sending the sig to DB//////
app.post("/sign", (req, res) => {
    db.insertSig(req.body.signature, req.session.user)
        .then(result => {
            req.session.signatureId = result["rows"][0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("err in insertData: ", err);
        });
});

app.get("/login", checkForUser, (req, res) => {
    res.render("loginview", {
        layout: "mainlay",
        title: "Simon's Petition"
    });
});
app.post("/login", (req, res) => {
    db.thisUser(req.body.email).then(data => {
        req.session.user = data["rows"][0].id;
        req.session.first = data["rows"][0].first;
        req.session.last = data["rows"][0].last;
        db.checkPassword(req.body.password, data["rows"][0].password)
            .then(doesMatch => {
                if (doesMatch) {
                    res.redirect("/sign");
                } else {
                    res.render("loginview", {
                        layout: "mainlay",
                        title: "Simon's Petition",
                        message: "wrong username / password, please try again"
                    });
                }
            })
            .catch(err => {
                console.log("err in checkPassword: ", err);
            });
    });
});
app.get("/thanks", (req, res) => {
    // db.getNumber().then(numOfSigners => {
    db.getPic(req.session.signatureId).then(sig => {
        res.render("thanksview", {
            layout: "mainlay",
            message: req.session.first + " " + req.session.last,
            title: "Simon's Petition",
            numOfSigners: "Who else?",
            sig: sig
        });
    });
    // });
});
app.get("/profile", (req, res) => {
    res.render("profileview", {
        layout: "mainlay",
        title: "Simon's Petition"
    });
});
app.post("/profile", (req, res) => {
    db.insertNewProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.user
    ).then(result => {
        req.session.age = result["rows"][0].age;
        req.session.city = result["rows"][0].city;
        req.session.url = result["rows"][0].url;
        res.redirect("/sign");
    });
});

app.get("/supporters", (req, res) => {
    db.allSupporter()
        .then(data => {
            return data["rows"];
        })
        .then(supporter => {
            res.render("supportersview", {
                layout: "mainlay",
                supporter: supporter
            });
        });
});
// app.get("/supporters/:city", (req, res) => {
//     db.allSupporter()
//         .then(data => {
//             return data["rows"];
//         })
//         .then(supporter => {
//             res.render("supportersview", {
//                 layout: "mainlay",
//                 supporter: supporter
//             });
//         });
// });

app.listen(8080, () => {
    console.log("listening on port 8080");
});
