require('dotenv').config();

var express = require('express');
var passport = require('passport');
var LichessStrategy  = require('passport-lichess').Strategy;

passport.use(new LichessStrategy({
    clientID: process.env['Lichess_clientId'],
    clientSecret: process.env['Lichess_clientSecret'],
    callbackURL: "/auth/lichess/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ lichessId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null, profile);
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  
// Create a new Express application.
var app = express();

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Authenticate Requests

app.get('/auth/lichess',
  passport.authenticate('lichess', {
    session: false
  }));

app.get('/auth/lichess/callback',
  passport.authenticate('lichess', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send(`<h1>Success!</h1>Your lichess user info: <pre>${JSON.stringify(req.user)}</pre>`);
    //res.redirect('/');
  });

  app.listen(process.env['PORT'] || 3000);