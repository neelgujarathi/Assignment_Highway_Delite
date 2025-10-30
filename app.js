import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";

import ExpressError from "./utils/ExpressError.js";
import listingRouter from "./routes/listingRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import userRouter from "./routes/userRouter.js";
import bookingRoutes from "./routes/booking.routes.js";
import User from "./models/user.js";
import confirmationRoutes from "./routes/confirmation.js";

// ✅ Fix: Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix: Create app before using routes
const app = express();

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ✅ MongoDB connection
const db = process.env.ATLASDB;

async function main() {
  await mongoose.connect(db);
  console.log("✅ MongoDB Connection Successful");
}
main().catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Session Store
const store = MongoStore.create({
  mongoUrl: db,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600, // 1 day
});

store.on("error", (err) => {
  console.log("❌ Error in Mongo Session Store:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + Current User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ Routes
app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);
app.use("/booking", bookingRoutes);

app.use("/", confirmationRoutes);

// ✅ 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "This page is not Found!!!"));
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).render("./listing/error.ejs", { message });
});

// ✅ Start server
app.listen(8082, () => {
  console.log("🚀 Server is starting at port 8082...");
});
