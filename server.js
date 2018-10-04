const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(cookieParser());

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("mainview", {
        layout: "mainlay",
        message: "MATT DONT GO!",
        submessage: `Sign our petition to convince Matt
        to stay at Spiced until Sage will finish the boot-camp`,
        title: "Simon's Petition"
    });
});

app.post("/", (req, res) => {
    if (!req.cookies.userLovesCookies) {
        res.cookie(first, last);
    } else {
        res.cookie("userLovesCookies", true);
        res.redirect("/thanks");
    }
});

app.get("/thanks", (req, res) => {
    res.render("thanksview", {
        layout: "mainlay",
        message: "MATT DONT GO!",
        submessage: `Sign our petition to convince Matt
        to stay at Spiced until Sage will finish the boot-camp`,
        thanksmessage: `Thanks for keeping Matt with us
        WE LOVE YOU MATT`,
        title: "Simon's Petition"
    });
});
// app.get("/projects/:name", (req, res) => {
//     let descripJson = require(`./projects/${req.params.name}/
//     ${req.params.name}.json`);
//     console.log(descripJson);
//     res.render("descview", {
//         layout: "desclay",
//         desc: descripJson,
//         name: "./projects/" + req.params.name
//     });
// });

app.listen(8080, () => {
    console.log("listening on port 8080");
});
