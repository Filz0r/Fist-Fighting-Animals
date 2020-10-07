require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
require('./controllers/passport')(passport)
const upload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const app = express()

app.use(expressLayouts);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(upload())
app.use(cookieParser('secret'))

// passport 
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    name: 'Fist Fighting Animals',
    saveUninitialized: true,
    cookie:{
        _expires : 7200000,
        sameSite: 'Lax'
    }
}))
app.use(passport.initialize())
app.use(passport.session())


//global variables
app.use( (req, res, next) => {
    res.locals.messages = req.flash('message')
    res.locals.error = req.flash('error')
    res.locals.changes = req.flash('changes')
    res.locals.paths = req.flash('path')
    next()
})

// routes 
app.use('/', require('./routes/index'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/admin', require('./routes/admin'))
app.use('/account', require('./routes/users/account'))
app.use('/fight', require('./routes/users/fight'))
app.use('/user', require('./routes/users/user'))
app.use('/delete', require('./routes/users/delete'))
app.use('/edit', require('./routes/users/edit'))

// logout
app.get('/logout', (req, res) => {
    req.logOut()
    req.flash('message', 'you are logged out!')
    res.redirect('/login')
})
// starts server
const port = 2500
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`connected on port: ${ port }`)
    }
})

//checks for connection
mongoose.connect(process.env.DATABASE_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
mongoose.connection.once('open', async (err) => {
    console.log('mongoDB connected successfully!')
    if (err) return console.log(err)
}).on('error', (err) => {
    console.log(`there was an error: ${err}`)
})
