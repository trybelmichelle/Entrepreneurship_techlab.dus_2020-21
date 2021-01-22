const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');

const sessionConfig = {
    name: 'session',
    secret: 'thisisnotagoodsecret',
    resave: 'false',
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!")
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', userRoutes);


// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }
//     next();
// }
// app.get('/', (req, res) => {
//     res.render('homepage')
// })

app.get('/schueler', (req, res) => {
    res.render('schueler')
})

app.get('/schulen', (req, res) => {
    res.render('schulen')
})

app.get('/ueber', (req, res) => {
    res.render('ueber', { title: "ueber" })
})

app.get('/kontakt', (req, res) => {
    res.render('kontakt')
})

app.get('/impressum', (req, res) => {
    res.render('impressum')
})

app.get('/datenschutz', (req, res) => {
    res.render('datenschutz')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.get('/downloads', (req, res) => {
    res.render('downloads')
})

app.get('/lernpfad', (req, res) => {
    res.render('lernpfad')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username, password })
    await user.save();
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const foundUser = await User.findandValidate(username, password);
//     if (foundUser) {
//         req.session.user_id = foundUser._id;
//         res.redirect('/secret');
//     }
//     else {
//         res.redirect('/login')
//     }
// })

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
})

// app.get('/secret', requireLogin, (req, res) => {
//     res.send('secret')
// })
// app.get('/topsecret', requireLogin, (req, res) => {
//     res.send("TOP SECRET!!")
// })

app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})