const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { email, username, password, firstname, lastname, schoolname, numberofstudents } = req.body;
    const user = new User({ email, username, firstname, lastname, schoolname, numberofstudents });
    const registeredUser = await User.register(user, password);
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/lernpfad')
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
