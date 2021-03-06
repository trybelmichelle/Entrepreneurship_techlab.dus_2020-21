const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const ejs = require('ejs');
const PORT = process.env.PORT || 5000;


const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

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

mongoose.connect('mongodb+srv://jungevisionaere:jungevisionaere1!@cluster0.nzz7s.mongodb.net/Cluster0?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
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

app.use(cookieParser());
app.use(session({ secret: "secret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// app.use(app.router);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new LocalStrategy({
//     passReqToCallback: true
// }, function (req, username, password, done) {}));


app.use('/', userRoutes);

app.use(express.static('assets'));


// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }
//     next();
// }

app.get('/', (req, res) => {
    res.render('homepage')
})

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

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/lernpfad', isLoggedIn, (req, res) => {
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

app.listen(PORT, () => {
    console.log("SERVING YOUR APP!")
})




// <% const isLoggedIn = (req, res) => { %>
//     <% if (req.isAuthenticated() = true) { %>
//       <% return %>
//         <div class="d-grid gap-2 d-md-flex justify-content-md-end">
//           <a class="btn btn-outline-secondary me-md-2" type="button" href="/logout">Abmelden</a>
//         </div>
//         <%} else %>
//           <div class="d-grid gap-2 d-md-flex justify-content-md-end">
//             <a class="btn btn-outline-secondary me-md-2" type="button" href="/login">Anmelden</a>
//             <a class="btn btn-primary" type="button" href="/register"
//               style="background-color: #a8a5cb; border-color: gray;">Registrieren</a>
//           </div>
//           <% } %>