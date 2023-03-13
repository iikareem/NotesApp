require('dotenv').config();
const express = require('express');
const connectDB = require('./server/config/db')
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// used to maintain session information for authenticated users
// (i.e. you will import this library irrespective of the type of “Strategy” that you will use to authenticate the user).
// deals with already authenticated users, and does not play any part in actually authenticating the users.
// Its sole purpose is to maintain (attach) the (already authenticated) user to sessions.
const passport = require('passport');


const session = require('express-session');
const MongoStore = require('connect-mongo');


const app = express()

const port = 5000 || process.env.PORT

// authentication

// How sessions works
// When the client makes a login request to the server, the server will create a session and store it on the server-side // DataBase
// When the server responds to the client, it sends a cookie. This cookie will contain the session’s unique id stored on the server / Database,
// which will now be stored on the client. This cookie will be sent on every request to the server.
app.use(session({

    secret: 'keyboard cat', // a random unique string key used to authenticate a session to protect from session hijacking.
    // session hijacking (this involves the attacker acquiring the session ID)
    // The Express session middleware...calculates a hash over the combination of the session id and a secret.
    // Since calculating the hash requires possession of the secret, an attacker will not be able
    // to generate valid session ids without guessing the secret (or just trying to guess the hash).

    resave: false,
    // How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the touch method.
    // If it does, then you can safely set resave: false. If it does not implement the touch method and your store sets an expiration date on stored sessions,
    // then you likely need resave: true.

    saveUninitialized: true,
    // Choosing false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
    // Choosing false will also help with race conditions where a client makes multiple parallel requests without a session.

    //
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE
    })
}));
// passport.initialize() is a middle-ware that initialises Passport.
// init passport on every route call.
app.use(passport.initialize());

//  If the credentials are valid(3aml log in sa7 ), a login session is established by
//  setting a cookie containing a session identifier in the user's web browser.
// allow passport to use "express-session".
app.use(passport.session());


// for post , put Requests and send data to different pages
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(methodOverride('_method'));
// database connect
connectDB();

// Static Files
app.use(express.static('public'));


// Templating Engine
app.use(expressLayouts);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));
app.use('/', require('./server/routes/auth'));


app.get('*', function (req, res) {
    res.status(404).render('404');
})
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})

