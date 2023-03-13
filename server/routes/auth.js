const express = require('express');
const router = express.Router();
const User = require('../models/User');


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
    // Tokens are pieces of data that carry just enough information to facilitate the process of determining a user's identity or
     // authorizing a user to perform an action
    // Access tokens are used in token-based authentication to allow an application to access an API (Google)
    //  refreshToken :for security purposes, access tokens may be valid for a short amount of time. Once they expire, client applications can use a refresh token to "refresh" the access token. That is,
    // a refresh token is a credential artifact that lets a client application get new access tokens without having to ask the user to log in again.
    //  The “done()” function is then used to pass the “{authenticated_user}” to the serializeUser() function.
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value,
        };
        try {
            let user = await User.findOne({ googleId: profile.id });
            console.log(user);
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.log(error);
        }

    }
));

// Google login Route
router.get('/auth/google',
    passport.authenticate("google", { scope: ["email", "profile"] }));


//// callback route for google to redirect to
//  hand control to passport to use code to grab profile info
router.get('/google/callback',
    passport.authenticate('google',
        {
            failureRedirect: '/login-failure',
            successRedirect: '/dashboard'
        })

    );

// Destroy user session
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) {
            console.log(error);
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
});

router.get('/login-failure',(req,res)=>{
    res.send('Something went wrong')
});

//  All the serializeUser() function does is,
// receives the "authenticated user" object from the "Strategy" framework => done(null,user),
// and attach the authenticated user to "req.session.passport.user.{..}"
// serializeUser determines which data of the user object should be stored in the session.
// The result of the serializeUser method is attached to the session as req.session.passport.user = {}.
// This allows the authenticated user to be "attached" to a unique session
passport.serializeUser(function (user,done){
    done(null,user.id);
});


// Retrieve user data from session
// Now anytime we want the user details for a session,
// we can simply get the object that is stored in “req.session.passport.user.{..}”.
// We can extract the user information from the {..} object
// and perform additional search our database for that user to get additional user information,
// or to simply display the user name on a dashboard.
// calling the done() in the "deserializeUser"
// will take that last object that was attached to req.session.passport.user.{..}
// and attach to req.user.{..}
//So "req.user" will contain the authenticated user object for that session,
// and you can use it in any of the routes in the Node JS app.
// eg. app.get("/dashboard", (req, res) => {
// res.render("dashboard.ejs", {name: req.user.name})
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = router;














