import User from "../models/user.js";

// Render Signup Form
export const renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Handle Signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.logIn(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome! to Wanderlust");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render Login Form
export const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Handle Login
export const login = async (req, res) => {
  req.flash("success", "Welcome back! to Wanderlust...");
  const redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

// Handle Logout
export const logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "You logged out successfully");
    res.redirect("/listing");
  });
};
