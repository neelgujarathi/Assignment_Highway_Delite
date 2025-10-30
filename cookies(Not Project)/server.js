const express = require("express");
const app = express();
const session = require("express-session");
//const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretCode"));

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
// });

// app.get("/verify", (req, res) => {
//   console.dir(req.signedCookies);
// });

// app.get("/greet", (req, res) => {
//   let { Name = "Unknown" } = req.cookies;
//   res.send(`Hello! ${Name}`);
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "hello", { signed: true });
//   res.send("Cookie sent successfully....");
// });

app.use(
  session({
    secret: "mysuperscretecode",
    resave: false,
    saveUninitialized: true,
  })
);

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You send request ${req.session.count} times`);
// });

app.get("/register", (req, res) => {
  let { name = "Anonymous" } = req.query;
  req.session.name = name;
  res.send(name);
});

app.get("/hello", (req, res) => {
  res.send(`Hello, ${req.session.name}`);
});

app.get("/test", (req, res) => {
  res.send("Test Successful....");
});

app.listen(3000, () => {
  console.log("Serever started at 3000");
});
