require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
require('./controllers/passport')(passport)

const app = express()
//checks for connection
mongoose.connect(process.env.DATABASE_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connection.once('open', async () => {
    console.log('mongoDB connected successfully!')
}).on('error', (err) => {
    console.log(`there was an error: ${err}`)
});

// app.use(expressLayouts);
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// passport 
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

//global error variables
app.use(function (req, res, next) {
    res.locals.messages = req.flash('message')
    res.locals.error = req.flash('error')
    next()
})

// routes 
app.use('/', require('./routes/index'))
app.use('/login', loginRouter)
app.use('/register', registerRouter)

// logout
app.get('/logout', (req, res) => {
    req.logOut()
    req.flash('message', 'you are logged out!')
    res.redirect('/login')
})
// starts server
app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('connected!')
    }
})


