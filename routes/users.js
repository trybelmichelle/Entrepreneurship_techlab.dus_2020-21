const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failurFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/lernpfad')
})

router.get('/logout', (req, res) => {
    req.logout();
    req.redirect('/homepage')
})

module.exports = router;
